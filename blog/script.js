document.addEventListener('DOMContentLoaded', function() {
    // Sample blog data (in a real app, this would come from an API)
    const blogData = [
        {
            id: 1,
            title: "The Future of Autonomous Robots in Healthcare",
            excerpt: "Exploring how autonomous robots are revolutionizing patient care and medical procedures in hospitals worldwide.",
            category: "news",
            date: "June 15, 2023",
            author: "Dr. Sarah Chen",
            image: "../assets/images/blog-1.jpg"
        },
        {
            id: 2,
            title: "Building Your First Robot: A Beginner's Guide",
            excerpt: "Step-by-step tutorial on assembling and programming your first robotic arm using Arduino and basic components.",
            category: "tutorials",
            date: "June 10, 2023",
            author: "Mike Robertson",
            image: "../assets/images/blog-2.jpg"
        },
        {
            id: 3,
            title: "Ethical Considerations in AI Robotics",
            excerpt: "Examining the moral dilemmas and ethical frameworks needed as robots become more autonomous and intelligent.",
            category: "opinion",
            date: "June 5, 2023",
            author: "Prof. Alan Turing",
            image: "../assets/images/blog-3.jpg"
        },
        {
            id: 4,
            title: "Breakthrough in Robotic Grasping Technology",
            excerpt: "New research from MIT demonstrates robots that can handle delicate objects with human-like precision.",
            category: "research",
            date: "May 28, 2023",
            author: "Lisa Zhang",
            image: "../assets/images/blog-4.jpg"
        },
        {
            id: 5,
            title: "Robotics in Agriculture: The Future of Farming",
            excerpt: "How autonomous tractors and harvesting robots are increasing yields and reducing labor costs.",
            category: "news",
            date: "May 20, 2023",
            author: "Carlos Mendez",
            image: "../assets/images/blog-5.jpg"
        },
        {
            id: 6,
            title: "Programming Robot Vision with Python",
            excerpt: "Tutorial on implementing basic computer vision for your robot using OpenCV and Python.",
            category: "tutorials",
            date: "May 15, 2023",
            author: "Emma Wilson",
            image: "../assets/images/blog-6.jpg"
        }
    ];

    // DOM Elements
    const postsContainer = document.getElementById('postsContainer');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageNumbers = document.getElementById('pageNumbers');

    // Pagination variables
    let currentPage = 1;
    const postsPerPage = 4;
    let filteredBlogData = [...blogData];

    // Initialize the blog
    function initBlog() {
        renderBlogPosts();
        renderPagination();
        setupEventListeners();
    }

    // Render blog posts based on current filters and page
    function renderBlogPosts() {
        postsContainer.innerHTML = '';
        
        const startIndex = (currentPage - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const postsToShow = filteredBlogData.slice(startIndex, endIndex);
        
        if (postsToShow.length === 0) {
            postsContainer.innerHTML = '<p class="no-results">No blog posts found matching your criteria.</p>';
            return;
        }
        
        postsToShow.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'blog-card';
            postElement.innerHTML = `
                <img src="${post.image}" alt="${post.title}">
                <div class="blog-content">
                    <div class="blog-meta">
                        <span class="blog-date">${post.date}</span>
                        <span class="blog-category ${post.category}">${getCategoryName(post.category)}</span>
                    </div>
                    <h3>${post.title}</h3>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <a href="#" class="read-more">Read More</a>
                </div>
            `;
            postsContainer.appendChild(postElement);
        });
    }

    // Render pagination controls
    function renderPagination() {
        pageNumbers.innerHTML = '';
        const totalPages = Math.ceil(filteredBlogData.length / postsPerPage);
        
        if (totalPages <= 1) {
            document.querySelector('.pagination').style.display = 'none';
            return;
        }
        
        document.querySelector('.pagination').style.display = 'flex';
        
        // Previous button state
        prevBtn.disabled = currentPage === 1;
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('div');
            pageBtn.className = `page-number ${i === currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                renderBlogPosts();
                renderPagination();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            pageNumbers.appendChild(pageBtn);
        }
        
        // Next button state
        nextBtn.disabled = currentPage === totalPages;
    }

    // Filter blog posts by category
    function filterByCategory(category) {
        if (category === 'all') {
            filteredBlogData = [...blogData];
        } else {
            filteredBlogData = blogData.filter(post => post.category === category);
        }
        currentPage = 1;
        renderBlogPosts();
        renderPagination();
    }

    // Search blog posts
    function searchPosts() {
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm.trim() === '') {
            filteredBlogData = [...blogData];
        } else {
            filteredBlogData = blogData.filter(post => 
                post.title.toLowerCase().includes(searchTerm) || 
                post.excerpt.toLowerCase().includes(searchTerm) ||
                post.author.toLowerCase().includes(searchTerm)
            );
        }
        currentPage = 1;
        renderBlogPosts();
        renderPagination();
    }

    // Helper function to get category display name
    function getCategoryName(category) {
        const names = {
            'news': 'Industry News',
            'tutorials': 'Tutorial',
            'research': 'Research',
            'opinion': 'Opinion'
        };
        return names[category] || category;
    }

    // Set up event listeners
    function setupEventListeners() {
        // Filter buttons
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                filterByCategory(this.dataset.category);
            });
        });
        
        // Search functionality
        searchBtn.addEventListener('click', searchPosts);
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') searchPosts();
        });
        
        // Pagination buttons
        prevBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                renderBlogPosts();
                renderPagination();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
        
        nextBtn.addEventListener('click', function() {
            const totalPages = Math.ceil(filteredBlogData.length / postsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderBlogPosts();
                renderPagination();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
        
        // Newsletter form
        const newsletterForm = document.getElementById('blogNewsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = this.querySelector('input').value;
                console.log('Blog subscriber:', email);
                alert('Thanks for subscribing to our blog updates!');
                this.reset();
            });
        }
    }

    // Initialize the blog
    initBlog();
});