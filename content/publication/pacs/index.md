---
title: "PACS: Priority-Aware Collaborative Sensing for Connected and Autonomous Vehicles"
authors: 
  - Zhengru Fang
  - admin
  - Haonan An
  - Yuang Zhang
  - Jingjing Wang
  - Hangcheng Cao
  - Xianhao Chen
  - Yuguang Fang
author_notes:
# - "Equal contribution"
# - "Equal contribution"
# - 
date: "2023-09-29T00:00:00Z"
doi: ""

# Schedule page publish date (NOT publication's date).
publishDate: "2017-01-01T00:00:00Z"

# Publication type.
# Legend: 0 = Uncategorized; 1 = Conference paper; 2 = Journal article;
# 3 = Preprint / Working Paper; 4 = Report; 5 = Book; 6 = Book section;
# 7 = Thesis; 8 = Patent
publication_types: ["3"]

# Publication name and optional abbreviated publication name.
publication: ""
publication_short: ""

abstract:  Positioning and sensing are quintessential for ensuring the safety and reliability of autonomous vehicles, where the Bird’s Eye View (BEV) has been employed to accurately capture spatial relationships among vehicles. However, recent advancements have identified inherent limitations with the BEV, particularly the blind spots. Collaborative sensing has emerged as a promising avenue to enhance sensing accuracy, leveraging data fusion from multiple vehicles through wireless channels. While the majority of extant collaborative sensing strategies adopt a fully connected graph predicated on fairness in transmission, these approaches often overlook the varying priorities of individual vehicles, influenced by channel states and sensing redundancy. Therefore, despite notable progress in the domain of collaborative sensing, current methodologies exhibit limitations, especially for data-intensive transmission under restricted channel capacity. To address these challenges, we introduce a novel Priority-Aware Collaborative Sensing (PACS) framework. This framework employs a BEV-match mechanism to discern the priority levels by computing the correlation between nearby Connected Autonomous Vehicles (CAVs) and the ego vehicle. By leveraging submodular optimization, we determine optimal transmission rates, link connectivity, and compression metrics. Additionally, a deep learning-based adaptive autoencoder is deployed, which modulates the image reconstruction quality under dynamic channel conditions. Experimental analysis underscores that PACS’s utility value and average precision of the Intersection over Union (AP@IoU) notably outperform the state-of-the-art algorithms and frameworks by 8.27% and 14.74%, respectively.

# Summary. An optional shortened abstract.
# summary: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis posuere tellus ac convallis placerat. Proin tincidunt magna sed ex sollicitudin condimentum.

# tags:
# - Source Themes
# featured: false

# links:
# - name: ""
#   url: ""
# url_pdf: http://arxiv.org/pdf/1512.04133v1
# url_code: 'https://github.com/wowchemy/wowchemy-hugo-themes'
# url_dataset: ''
# url_poster: ''
# url_project: ''
# url_slides: ''
# url_source: ''
# url_video: ''
url_preprint: 'https://www.researchgate.net/publication/375491368_PACS_Priority-Aware_Collaborative_Sensing_for_Connected_and_Autonomous_Vehicles'

# Featured image
# To use, add an image named `featured.jpg/png` to your page's folder. 
# image:
#   caption: 'Image credit: [**Unsplash**](https://unsplash.com/photos/jdD8gXaTZsc)'
#   focal_point: ""
#   preview_only: false

# Associated Projects (optional).
#   Associate this publication with one or more of your projects.
#   Simply enter your project's folder or file name without extension.
#   E.g. `internal-project` references `content/project/internal-project/index.md`.
#   Otherwise, set `projects: []`.
projects: []

# Slides (optional).
#   Associate this publication with Markdown slides.
#   Simply enter your slide deck's filename without extension.
#   E.g. `slides: "example"` references `content/slides/example/index.md`.
#   Otherwise, set `slides: ""`.
slides: ''
---

<!-- {{% callout note %}}
Click the *Cite* button above to demo the feature to enable visitors to import publication metadata into their reference management software.
{{% /callout %}}

{{% callout note %}}
Create your slides in Markdown - click the *Slides* button to check out the example.
{{% /callout %}}

Supplementary notes can be added here, including [code, math, and images](https://wowchemy.com/docs/writing-markdown-latex/). -->
