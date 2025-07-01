// Interactive functionality for SARIF Report Viewer
(function() {
    // Store violation data for all files
    const violationData = {};
    
    // File selection
    function setupFileSelection() {
        const fileItems = document.querySelectorAll('.file-item');
        fileItems.forEach(item => {
            item.addEventListener('click', function() {
                // Remove active class from all items
                fileItems.forEach(i => {
                    i.classList.remove('active');
                    const card = i.querySelector('.bg-white.border');
                    if (card) {
                        card.classList.remove('border-blue-300', 'shadow-lg', 'bg-blue-50', 'ring-2', 'ring-blue-100');
                        card.classList.add('border-gray-200');
                    }
                });
                
                // Add active class to clicked item
                this.classList.add('active');
                const card = this.querySelector('.bg-white.border');
                if (card) {
                    card.classList.remove('border-gray-200');
                    card.classList.add('border-blue-300', 'shadow-lg', 'bg-blue-50', 'ring-2', 'ring-blue-100');
                }
                
                // Update content area
                const fileName = this.querySelector('.file-name').textContent;
                updateContentArea(fileName);
            });
        });
    }
    
    // Update content area with selected file
    function updateContentArea(fileName) {
        const contentArea = document.getElementById('content-area');
        if (!contentArea) return;
        
        // Find the violation list container
        const violationListContainer = document.getElementById('violation-list-container');
        if (!violationListContainer) return;
        
        // Get all violation lists
        const violationLists = violationListContainer.querySelectorAll('.violation-list');
        
        // Hide all violation lists
        violationLists.forEach(list => {
            list.style.display = 'none';
        });
        
        // Find and show the violation list for the selected file
        const targetViolationList = Array.from(violationLists).find(list => 
            list.getAttribute('data-filename') === fileName
        );
        
        if (targetViolationList) {
            targetViolationList.style.display = 'block';
        } else {
            // Fallback: show the first violation list if the target is not found
            const firstViolationList = violationLists[0];
            if (firstViolationList) {
                firstViolationList.style.display = 'block';
                
                // Update the header to show the selected file name
                const header = firstViolationList.querySelector('h2');
                if (header) {
                    header.textContent = fileName;
                }
                
                const filePath = firstViolationList.querySelector('.text-sm.text-gray-500.font-mono');
                if (filePath) {
                    filePath.textContent = fileName;
                }
            }
        }
    }
    
    // Violation toggle
    function setupViolationToggles() {
        document.addEventListener('click', function(e) {
            const violationHeader = e.target.closest('.violation-header');
            if (violationHeader) {
                const violationItem = violationHeader.closest('.violation-item');
                const content = violationItem.querySelector('.violation-content');
                const toggle = violationItem.querySelector('.violation-toggle');
                
                if (content) {
                    if (content.style.display === 'none') {
                        content.style.display = 'block';
                        toggle.textContent = '−';
                    } else {
                        content.style.display = 'none';
                        toggle.textContent = '+';
                    }
                }
            }
        });
    }
    
    // Search functionality
    function setupSearch() {
        const searchInput = document.getElementById('file-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const searchTerm = this.value.toLowerCase();
                const fileItems = document.querySelectorAll('.file-item');
                
                fileItems.forEach(item => {
                    const fileName = item.querySelector('.file-name');
                    if (fileName) {
                        const fileNameText = fileName.textContent.toLowerCase();
                        if (fileNameText.includes(searchTerm)) {
                            item.style.display = 'block';
                        } else {
                            item.style.display = 'none';
                        }
                    }
                });
                
                // Show/hide no results message
                const visibleItems = Array.from(fileItems).filter(item => 
                    item.style.display !== 'none'
                );
                
                let noResultsMsg = document.getElementById('no-results');
                if (visibleItems.length === 0 && searchTerm) {
                    if (!noResultsMsg) {
                        const container = document.getElementById('file-list');
                        if (container) {
                            noResultsMsg = document.createElement('div');
                            noResultsMsg.id = 'no-results';
                            noResultsMsg.className = 'text-center py-12';
                            noResultsMsg.innerHTML = `
                                <p class="text-gray-500 text-lg">No files match "${searchTerm}"</p>
                            `;
                            container.appendChild(noResultsMsg);
                        }
                    }
                } else if (noResultsMsg) {
                    noResultsMsg.remove();
                }
            });
        }
    }
    
    // Initialize when DOM is loaded
    function initializeApp() {
        console.log('SARIF Report Viewer initialized');
        setupFileSelection();
        setupViolationToggles();
        setupSearch();
        
        // Auto-select first file if none is selected
        const activeFile = document.querySelector('.file-item.active');
        if (!activeFile) {
            const firstFile = document.querySelector('.file-item');
            if (firstFile) {
                firstFile.click();
            }
        }
    }
    
    // Check if DOM is already loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        // DOM is already loaded
        setTimeout(initializeApp, 100);
    }
})(); 