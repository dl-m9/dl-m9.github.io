document.addEventListener('DOMContentLoaded', function() {
    // Load profile information
    loadProfileInfo();

    // Publication filters - including "First Author" for publications where user is first author or has equal contribution
    const filterBtns = document.querySelectorAll('.filter-btn');
    const publications = document.querySelectorAll('.publication');
    
    // Load publications data from JSON file
    loadPublications();
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from ALL buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to the clicked button
                this.classList.add('active');
            
            // Apply filters based on the single active button
            applyFilters();
        });
    });

    function applyFilters() {
        const activeBtns = document.querySelectorAll('.filter-btn.active');
        const activeFilters = Array.from(activeBtns).map(btn => btn.getAttribute('data-filter'));
        
        const pubElements = document.querySelectorAll('.publication');
        const sectionTitles = document.querySelectorAll('.publication-section-title');
        
        // Check if "all" is among the active filters (it should be the only one if it is active)
        if (activeFilters.includes('all')) {
            // Show all publications and section titles
            pubElements.forEach(pub => {
                pub.style.display = 'flex';
                // Reset to original number when showing all
                const numberElement = pub.querySelector('.pub-number');
                if (numberElement) {
                    numberElement.textContent = pub.dataset.originalNumber;
                }
            });
            sectionTitles.forEach(title => {
                title.style.display = 'block';
            });
        } else {
            // Filter logic: OR (Union)
            // A publication shows up if it matches ANY of the active filters
            
            // 1. Hide all publications by default
            pubElements.forEach(pub => {
                pub.style.display = 'none';
            });
            
            // 2. Show publications matching ANY active filter
            pubElements.forEach(pub => {
                let matchAny = false;
                
                for (const filter of activeFilters) {
                    if (filter === 'preprint' && pub.classList.contains('preprint')) matchAny = true;
                    else if (filter === 'accepted' && pub.classList.contains('accepted')) matchAny = true;
                    else if (filter === 'first-author' && pub.classList.contains('first-author')) matchAny = true;
                    else if (filter === 'llm-agent' && pub.classList.contains('llm-agent')) matchAny = true;
                    else if (filter === 'llm-peft' && pub.classList.contains('llm-peft')) matchAny = true;
                    else if (filter === 'multi-agent-security' && pub.classList.contains('multi-agent-security')) matchAny = true;
                    else if (filter === 'multi-agent-perception' && pub.classList.contains('multi-agent-perception')) matchAny = true;
                    else if (filter === 'others' && pub.classList.contains('others')) matchAny = true;
                    
                    if (matchAny) break;
                }
                
                if (matchAny) {
                    pub.style.display = 'flex';
                }
            });
            
            // 3. For each section title, check if it has visible publications below it
            sectionTitles.forEach(title => {
                let hasVisiblePub = false;
                let currentEl = title.nextElementSibling;
                while (currentEl && !currentEl.classList.contains('publication-section-title')) {
                    if (currentEl.classList.contains('publication') && currentEl.style.display === 'flex') {
                        hasVisiblePub = true;
                        break;
                    }
                    currentEl = currentEl.nextElementSibling;
                }
                title.style.display = hasVisiblePub ? 'block' : 'none';
            });
            
            // 4. Update publication numbers for all visible publications (global numbering)
            updatePublicationNumbers(true);
        }
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only apply smooth scrolling to hash links (internal page links)
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    // Adjust the offset to account for the fixed navigation bar
                    const navHeight = document.querySelector('nav').offsetHeight;
                    window.scrollTo({
                        top: targetSection.offsetTop - navHeight - 20,
                        behavior: 'smooth'
                    });
                    
                    // Update active class
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                }
            }
        });
    });
    
    // Update active nav link on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        const navHeight = document.querySelector('nav').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - navHeight - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Load news data
    // Determine the correct path for news.json based on current page
    let newsJsonPath = 'data/news.json';
    if (window.location.pathname.includes('/pages/')) {
        // If we're in the pages directory, we need to go up one level
        newsJsonPath = '../data/news.json';
    }
    
    fetch(newsJsonPath)
        .then(response => response.json())
        .then(data => {
            // Check if we're on the homepage
            const latestNewsSection = document.getElementById('latest-news');
            if (latestNewsSection) {
                // On homepage - show limited news (first 12 items)
                renderNewsItems(data.slice(0, 12), 'news-container');
            }
            
            // Check if we're on the all-news page
            const allNewsSection = document.getElementById('all-news');
            if (allNewsSection) {
                // On all-news page - show all news items
                renderNewsItems(data, 'all-news-container');
            }
        })
        .catch(error => {
            console.error('Error loading news data:', error);
        });
});

// Helper function to wrap Chinese characters with kai-font span
function wrapChineseWithKaiFont(text) {
    if (!text) return '';
    return text.replace(/([\u4e00-\u9fff]+)/g, '<span class="kai-font">$1</span>');
}

// Function to load profile information
function loadProfileInfo() {
    let profileJsonPath = 'data/profile-info.json';
    let isSubpage = window.location.pathname.includes('/pages/');
    if (isSubpage) {
        profileJsonPath = '../data/profile-info.json';
    }

    // Get profile-info container
    const profileInfoContainer = document.querySelector('.profile-info');
    if (!profileInfoContainer) return;

    fetch(profileJsonPath)
        .then(response => response.json())
        .then(data => {
            // Clear existing content
            profileInfoContainer.innerHTML = '';
            
            // Add name
            const nameElement = document.createElement('h1');
            nameElement.innerHTML = data.name;
            profileInfoContainer.appendChild(nameElement);
            
            // Add subtitle
            const subtitleElement = document.createElement('p');
            subtitleElement.className = 'subtitle';
            subtitleElement.innerHTML = wrapChineseWithKaiFont(data.subtitle);
            profileInfoContainer.appendChild(subtitleElement);
            
            // Add social links container
            const contactInfo = document.createElement('div');
            contactInfo.className = 'contact-info';
            
            // Add each social link
            data.socialLinks.forEach(link => {
                const linkContainer = document.createElement('p');
                const anchor = document.createElement('a');
                // Adjust URL paths for subpages
                if (isSubpage && link.url.startsWith('assets/')) {
                    anchor.href = '../' + link.url;
                } else {
                    anchor.href = link.url;
                }
                
                if (link.target) {
                    anchor.target = link.target;
                }
                
                // Fix SVG icon paths for subpages
                let iconHtml = link.icon;
                if (isSubpage && link.type === 'dblp') {
                    iconHtml = iconHtml.replace('src="assets/', 'src="../assets/');
                }
                
                anchor.innerHTML = iconHtml;
                linkContainer.appendChild(anchor);
                contactInfo.appendChild(linkContainer);
            });
            
            profileInfoContainer.appendChild(contactInfo);
            
            // Update profile image if there's a profile-image container
            const profileImageContainer = document.querySelector('.profile-image img');
            if (profileImageContainer && data.profileImage) {
                profileImageContainer.src = isSubpage ? 
                    '../' + data.profileImage : data.profileImage;
                profileImageContainer.alt = data.name;
            }
        })
        .catch(error => {
            console.error('Error loading profile information:', error);
        });
}

// Function to load publications from JSON
function loadPublications() {
    let publicationsJsonPath = 'data/publications.json';
    if (window.location.pathname.includes('/pages/')) {
        publicationsJsonPath = '../data/publications.json';
    }

    const publicationsList = document.querySelector('.publications-list');
    if (!publicationsList) return;
    
    // Clear existing publications
    publicationsList.innerHTML = '';
    
    fetch(publicationsJsonPath)
        .then(response => response.json())
        .then(publications => {
            // Group publications by type and year field
            const preprints = publications.filter(pub => pub.type === 'preprint');
            const accepted2026 = publications.filter(pub => pub.type === 'accepted' && pub.year === '2026');
            const accepted2025 = publications.filter(pub => pub.type === 'accepted' && pub.year === '2025');
            const accepted2024 = publications.filter(pub => pub.type === 'accepted' && pub.year === '2024');
            const patents = publications.filter(pub => pub.type === 'patent');
            
            // Debug - log the counts to console
            console.log('Preprints:', preprints.length);
            console.log('2026 Papers:', accepted2026.length);
            console.log('2025 Papers:', accepted2025.length);
            console.log('2024 Papers:', accepted2024.length);
            console.log('Patents:', patents.length);
            console.log('Total:', publications.length);
            console.log('Sum of groups:', preprints.length + accepted2026.length + accepted2025.length + accepted2024.length + patents.length);
            
            // Counters for auto-numbering publications
            let counter = 1;
            
            // Add section title for Preprints
            if (preprints.length > 0) {
                const preprintTitle = document.createElement('h3');
                preprintTitle.className = 'publication-section-title';
                preprintTitle.textContent = 'Preprints';
                publicationsList.appendChild(preprintTitle);
                
                // Add preprints
                renderPublicationGroup(preprints, publicationsList, counter);
                counter += preprints.length;
            }
            
            // Add section title for Accepted Papers in 2026
            if (accepted2026.length > 0) {
                const accepted2026Title = document.createElement('h3');
                accepted2026Title.className = 'publication-section-title';
                accepted2026Title.textContent = 'Accepted Papers in 2026';
                publicationsList.appendChild(accepted2026Title);
                
                // Add 2026 papers
                renderPublicationGroup(accepted2026, publicationsList, counter);
                counter += accepted2026.length;
            }
            
            // Add section title for Accepted Papers in 2025
            if (accepted2025.length > 0) {
                const accepted2025Title = document.createElement('h3');
                accepted2025Title.className = 'publication-section-title';
                accepted2025Title.textContent = 'Accepted Papers in 2025';
                publicationsList.appendChild(accepted2025Title);
                
                // Add 2025 papers
                renderPublicationGroup(accepted2025, publicationsList, counter);
                counter += accepted2025.length;
            }
            
            // Add section title for Accepted Papers in 2024
            if (accepted2024.length > 0) {
                const accepted2024Title = document.createElement('h3');
                accepted2024Title.className = 'publication-section-title';
                accepted2024Title.textContent = 'Accepted Papers in 2024';
                publicationsList.appendChild(accepted2024Title);
                
                // Add 2024 papers
                renderPublicationGroup(accepted2024, publicationsList, counter);
            }

            // Add section title for Patents
            if (patents.length > 0) {
                const patentsTitle = document.createElement('h3');
                patentsTitle.className = 'publication-section-title';
                patentsTitle.textContent = 'Patents';
                publicationsList.appendChild(patentsTitle);
                
                // Add patents (restart numbering from 1)
                renderPublicationGroup(patents, publicationsList, 1);
            }
        })
        .catch(error => {
            console.error('Error loading publications data:', error);
        });
}

// Function to render a group of publications
function renderPublicationGroup(publications, container, startCounter) {
    let counter = startCounter;
    
    publications.forEach(pub => {
        const pubElement = document.createElement('div');
        const classes = ['publication', pub.type];
        if (pub.isFirstAuthor) classes.push('first-author');
        if (pub.categories && pub.categories.length > 0) {
            pub.categories.forEach(category => {
                classes.push(category);
            });
        } else {
            // If no categories field or empty categories, add to others
            classes.push('others');
        }
        pubElement.className = classes.join(' ');
        
        // Store the original number as a data attribute for reference
        pubElement.dataset.originalNumber = counter;
        
        // Create venue/type label for left side
        const venueElement = document.createElement('div');
        venueElement.className = 'pub-venue-label';
        
        // Determine what text to show in the left column
        let venueText = '';
        if (pub.type === 'preprint') {
            venueText = 'Preprint';
        } else if (pub.type === 'patent') {
            const venueTag = pub.tags.find(tag => tag.class === 'venue-tag');
            venueText = venueTag ? venueTag.text : 'Patent';
        } else if (pub.venue) {
            // Extract short venue name from the venue string or tags
            const venueTag = pub.tags.find(tag => tag.class === 'venue-tag');
            venueText = venueTag ? venueTag.text : pub.venue.split(',')[0].split(' ').pop();
        }
        
        // Create publication number with a specific class for easy updates
        const numberElement = document.createElement('span');
        numberElement.className = 'pub-number';
        numberElement.textContent = counter++;
        
        venueElement.appendChild(numberElement);
        
        // Add venue text below the number
        const venueTextElement = document.createElement('span');
        venueTextElement.className = 'venue-text';
        venueTextElement.innerHTML = wrapChineseWithKaiFont(venueText);
        venueElement.appendChild(venueTextElement);
        
        // Create publication content container
        const contentElement = document.createElement('div');
        contentElement.className = 'pub-content';

        // Create main content wrapper
        const contentMainElement = document.createElement('div');
        contentMainElement.className = 'pub-content-main';

        // Create text content wrapper
        const contentTextElement = document.createElement('div');
        contentTextElement.className = 'pub-content-text';
        
        // Add title
        const titleElement = document.createElement('h3');
        titleElement.innerHTML = wrapChineseWithKaiFont(pub.title);
        contentTextElement.appendChild(titleElement);
        
        // Add authors
        const authorsElement = document.createElement('p');
        authorsElement.className = 'authors';
        authorsElement.innerHTML = wrapChineseWithKaiFont(pub.authors);
        contentTextElement.appendChild(authorsElement);
        
        // Add full venue if it exists (for accepted papers)
        if (pub.venue) {
            const fullVenueElement = document.createElement('p');
            fullVenueElement.className = 'venue';
            fullVenueElement.innerHTML = wrapChineseWithKaiFont(pub.venue);
            contentTextElement.appendChild(fullVenueElement);
        }
        
        // Add tags
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'pub-tags';
        
        pub.tags.forEach(tag => {
            // Skip venue tag as we're now showing it on the left
            if (tag.class === 'venue-tag') return;
            
            if (tag.link) {
                const tagLink = document.createElement('a');
                tagLink.href = tag.link;
                tagLink.className = `tag ${tag.class}`;
                tagLink.innerHTML = wrapChineseWithKaiFont(tag.text);
                tagLink.target = "_blank";
                tagLink.rel = "noopener noreferrer";
                tagsContainer.appendChild(tagLink);
            } else {
                const tagSpan = document.createElement('span');
                tagSpan.className = `tag ${tag.class}`;
                tagSpan.innerHTML = wrapChineseWithKaiFont(tag.text);
                tagsContainer.appendChild(tagSpan);
            }
        });

        // Add text content and tags to main content wrapper
        contentMainElement.appendChild(contentTextElement);
        contentMainElement.appendChild(tagsContainer);
        
        // Add main content wrapper to content element
        contentElement.appendChild(contentMainElement);
        
        // Combine elements and add to publications list
        pubElement.appendChild(venueElement);
        pubElement.appendChild(contentElement);
        container.appendChild(pubElement);
    });
}

// Function to update publication numbers based on visible publications
function updatePublicationNumbers(flat = false) {
    // Get all visible publications
    const visiblePubs = document.querySelectorAll('.publication[style="display: flex;"]');
    
    // If no publications are visible, hide all section titles
    if (visiblePubs.length === 0) {
        const sectionTitles = document.querySelectorAll('.publication-section-title');
        sectionTitles.forEach(title => {
            title.style.display = 'none';
        });
        return;
    }
    
    if (flat) {
        // Flat mode: all visible publications are numbered 1,2,3...
        let counter = 1;
        visiblePubs.forEach(pub => {
            const numberElement = pub.querySelector('.pub-number');
            if (numberElement) {
                numberElement.textContent = counter++;
            }
        });
    } else {
        // Section mode: number within each section
        const visibleSectionTitles = document.querySelectorAll('.publication-section-title[style="display: block;"]');
        if (visibleSectionTitles.length > 0) {
            visibleSectionTitles.forEach(title => {
                let sectionCounter = 1;
                let currentEl = title.nextElementSibling;
                // Process all elements until next section title
                while (currentEl && !currentEl.classList.contains('publication-section-title')) {
                    if (currentEl.classList.contains('publication') && 
                        currentEl.style.display === 'flex') {
                        const numberElement = currentEl.querySelector('.pub-number');
                        if (numberElement) {
                            numberElement.textContent = sectionCounter++;
                        }
                    }
                    currentEl = currentEl.nextElementSibling;
                }
            });
        } else {
            // If no section titles are visible, number all visible publications sequentially
            let counter = 1;
            visiblePubs.forEach(pub => {
                const numberElement = pub.querySelector('.pub-number');
                if (numberElement) {
                    numberElement.textContent = counter++;
                }
            });
        }
    }
}

// Function to render news items
function renderNewsItems(newsData, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Clear any existing content
    container.innerHTML = '';
    
    // Add each news item to the container
    newsData.forEach(newsItem => {
        const newsElement = document.createElement('div');
        newsElement.className = 'news-item';
        
        // Create the date element
        const dateElement = document.createElement('div');
        dateElement.className = 'news-date';
        
        const dateHighlight = document.createElement('span');
        dateHighlight.className = 'year-highlight';
        dateHighlight.innerHTML = wrapChineseWithKaiFont(newsItem.date);
        dateElement.appendChild(dateHighlight);
        
        // Create the content element
        const contentElement = document.createElement('div');
        contentElement.className = 'news-content';
        
        // Create the title element
        const titleElement = document.createElement('h3');
        
        // Check if title contains HTML (like '<a href=')
        if (newsItem.title && newsItem.title.includes('<a href=')) {
            // Parse HTML in title with Chinese characters wrapped
            titleElement.innerHTML = wrapChineseWithKaiFont(newsItem.title);
        } else {
            titleElement.innerHTML = wrapChineseWithKaiFont(newsItem.title);
        }
        
        contentElement.appendChild(titleElement);
        
        // Create the paragraph for content
        const paragraphElement = document.createElement('p');
        paragraphElement.innerHTML = wrapChineseWithKaiFont(newsItem.content);
        
        // Add links if provided in the links array format
        if (newsItem.links && newsItem.links.length > 0) {
            newsItem.links.forEach(link => {
                // Add a space if needed
                const space = document.createTextNode(' ');
                paragraphElement.appendChild(space);
                
                // Create link
                const linkElement = document.createElement('a');
                linkElement.href = link.url;
                linkElement.innerHTML = wrapChineseWithKaiFont(link.text);
                linkElement.target = "_blank";
                linkElement.rel = "noopener noreferrer";
                paragraphElement.appendChild(linkElement);
            });
        }
        
        // Check for old style link (backward compatibility)
        if (newsItem.link && newsItem.linkText) {
            const space = document.createTextNode(' ');
            paragraphElement.appendChild(space);
            
            const linkElement = document.createElement('a');
            linkElement.href = newsItem.link;
            linkElement.innerHTML = wrapChineseWithKaiFont(newsItem.linkText);
            linkElement.target = "_blank";
            linkElement.rel = "noopener noreferrer";
            paragraphElement.appendChild(linkElement);
        }
        
        contentElement.appendChild(paragraphElement);
        
        // Add date and content to the news item
        newsElement.appendChild(dateElement);
        newsElement.appendChild(contentElement);
        
        // Add the news item to the container
        container.appendChild(newsElement);
    });
} 