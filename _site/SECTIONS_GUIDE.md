# Guide til at tilføje nye sektioner

## Struktur
Hver sektion består af 3 filer:
1. **Data fil** (`_data/[sektion].yml`) - Indholdet
2. **Include fil** (`_includes/[sektion]-section.html`) - HTML template
3. **CSS** - Styling i `assets/styles.css`

## Eksempel: Tilføj en ny "News" sektion

### 1. Opret data fil
Opret `_data/news.yml`:
```yaml
# News articles data
articles:
  - title: "Breaking: NEAR Protocol Update"
    summary: "Latest updates from the NEAR ecosystem"
    image: "/images/news1.jpg"
    date: "2025-01-17"
    link: "https://nearweek.com/news/breaking-near-update"
    
  - title: "Crypto Market Analysis"
    summary: "Weekly analysis of crypto market trends"
    image: "/images/news2.jpg"
    date: "2025-01-16"
    link: "https://nearweek.com/news/crypto-analysis"
```

### 2. Opret include fil
Opret `_includes/news-section.html`:
```html
<section class="news-section" id="news">
  <div class="container">
    <div class="section-header">
      <h2 class="section-title">Latest News</h2>
      <p class="section-subtitle">Stay updated with breaking news</p>
    </div>
    
    <div class="news-grid">
      {% for article in site.data.news.articles %}
        <article class="news-card">
          <div class="news-image">
            <img src="{{ article.image | relative_url }}" alt="{{ article.title }}">
          </div>
          <div class="news-content">
            <h3 class="news-title">{{ article.title }}</h3>
            <p class="news-summary">{{ article.summary }}</p>
            <div class="news-meta">
              <span class="news-date">{{ article.date | date: "%B %d, %Y" }}</span>
              <a href="{{ article.link }}" class="news-link">Read More</a>
            </div>
          </div>
        </article>
      {% endfor %}
    </div>
  </div>
</section>
```

### 3. Tilføj CSS
Tilføj til `assets/styles.css`:
```css
/* =========================
   News Section
   ========================= */
.news-section{ padding: 60px 0; }
.news-grid{ 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
  gap: 24px; 
  margin-top: 32px; 
}
.news-card{ 
  background: var(--card); 
  border: 1px solid var(--border); 
  border-radius: 12px; 
  overflow: hidden; 
  transition: transform .3s ease; 
}
.news-card:hover{ transform: translateY(-4px); }
/* ... flere styles ... */
```

### 4. Tilføj til index.html
Tilføj til `index.html`:
```html
<!-- Example: Add your new section include here -->
<!-- Replace 'your-section' with your actual section name -->
```

## Eksisterende sektioner
- **Hero** - `_includes/hero.html`
- **Cards Marquee** - `_includes/cards-marquee.html`
- **Blog** - `_includes/blog-section.html`
- **Merch** - `_includes/merch-section.html`
- **Footer** - `_includes/footer.html`

## Tips
- Brug `relative_url` filter for billeder
- Tilføj `loading="lazy"` til billeder
- Brug CSS variabler (`var(--bg)`, `var(--text)`, etc.)
- Tilføj hover effekter for bedre UX
- Brug responsive grid layouts
