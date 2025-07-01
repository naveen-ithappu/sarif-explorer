// Interactive functionality for SARIF Report Viewer
(function() {
    // File selection
    function setupFileSelection() {
        const fileItems = document.querySelectorAll('.file-item');
        fileItems.forEach(item => {
            item.addEventListener('click', function() {
                // Remove active class from all items
                fileItems.forEach(i => i.classList.remove('active'));
                // Add active class to clicked item
                this.classList.add('active');
                
                // Update content area
                const fileName = this.querySelector('.file-name').textContent;
                updateContentArea(fileName);
            });
        });
    }
    
    // Update content area with selected file
    function updateContentArea(fileName) {
        const contentArea = document.querySelector('.content-area');
        // This would be replaced with actual violation data
        contentArea.innerHTML = `
            <div class="file-details">
                <div class="file-details-header">
                    <h2>${fileName}</h2>
                    <div class="file-path">${fileName}</div>
                </div>
                <div class="no-violations">
                    <h2>📄 File Selected</h2>
                    <p>Violations for ${fileName} would be displayed here.</p>
                </div>
            </div>
        `;
    }
    
    // Violation toggle
    function setupViolationToggles() {
        document.addEventListener('click', function(e) {
            if (e.target.closest('.violation-header')) {
                const violationItem = e.target.closest('.violation-item');
                const content = violationItem.querySelector('.violation-content');
                const toggle = violationItem.querySelector('.violation-toggle');
                
                if (content.style.display === 'none') {
                    content.style.display = 'block';
                    toggle.textContent = '−';
                } else {
                    content.style.display = 'none';
                    toggle.textContent = '+';
                }
            }
        });
    }
    
    // Search functionality
    function setupSearch() {
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const fileItems = document.querySelectorAll('.file-item');
                
                fileItems.forEach(item => {
                    const fileName = item.querySelector('.file-name').textContent.toLowerCase();
                    if (fileName.includes(searchTerm)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        }
    }
    
    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        setupFileSelection();
        setupViolationToggles();
        setupSearch();
    });
})(); 