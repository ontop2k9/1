
// Mobile Navigation
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Category filtering
let currentCategory = 'all';

// Category tab functionality
document.addEventListener('DOMContentLoaded', () => {
    const categoryTabs = document.querySelectorAll('.tab-btn');
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            categoryTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Get selected category
            currentCategory = tab.dataset.category;
            
            // Filter files
            filterFiles();
        });
    });
});

// Enhanced search and filter functionality
const searchInput = document.getElementById('searchInput');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        filterFiles();
    });
}

function filterFiles() {
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const fileCards = document.querySelectorAll('.file-card');
    
    fileCards.forEach(card => {
        const fileName = card.querySelector('.file-info h4').textContent.toLowerCase();
        const fileCategory = card.dataset.category;
        
        const matchesSearch = fileName.includes(searchTerm);
        const matchesCategory = currentCategory === 'all' || fileCategory === currentCategory;
        
        if (matchesSearch && matchesCategory) {
            card.style.display = 'flex';
            card.style.animation = 'fadeIn 0.3s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

// File actions
function downloadFile(fileName) {
    showToast(`Đang tải ${fileName}...`, 'info');
    
    // Simulate download
    setTimeout(() => {
        showToast(`Tải ${fileName} thành công!`, 'success');
        
        // Update download count
        const fileCards = document.querySelectorAll('.file-card');
        fileCards.forEach(card => {
            const cardFileName = card.querySelector('.file-info h4').textContent;
            if (cardFileName === fileName) {
                const downloadStat = card.querySelector('.file-stats span:first-child');
                if (downloadStat) {
                    const currentCount = parseInt(downloadStat.textContent.match(/\d+/)[0]) || 0;
                    downloadStat.innerHTML = `<i class="fas fa-download"></i> ${currentCount + 1}`;
                }
            }
        });
    }, 1000);
}

function shareFile(fileName) {
    const shareUrl = `${window.location.href}#${fileName.replace(/\s+/g, '-').toLowerCase()}`;
    
    // Determine category based on filename
    let fileCategory = 'file';
    let categoryIcon = '📱';
    
    if (fileName.toLowerCase().includes('.ipa') || fileName.toLowerCase().includes('app')) {
        fileCategory = 'App';
        categoryIcon = '📱';
    } else if (fileName.toLowerCase().includes('game') || fileName.toLowerCase().includes('mod')) {
        fileCategory = 'Game';
        categoryIcon = '🎮';
    }
    
    if (navigator.share) {
        navigator.share({
            title: `Chia sẻ ${fileCategory} - ${fileName}`,
            text: `${categoryIcon} Tải ${fileCategory} "${fileName}" từ IPA Share`,
            url: shareUrl
        });
    } else {
        // Fallback - copy to clipboard
        navigator.clipboard.writeText(shareUrl).then(() => {
            showToast(`Link ${fileCategory.toLowerCase()} đã được copy vào clipboard!`, 'success');
        }).catch(() => {
            showToast('Không thể copy link!', 'error');
        });
    }
}

// Toast notification system - FIXED VERSION
function showToast(message, type = 'success') {
    // Create toast if it doesn't exist
    let toast = document.getElementById('toast');
    let toastMessage = document.getElementById('toastMessage');
    
    if (!toast) {
        // Create toast element
        toast = document.createElement('div');
        toast.id = 'toast';
        toast.className = 'toast';
        
        const toastContent = document.createElement('div');
        toastContent.className = 'toast-content';
        
        const toastIcon = document.createElement('i');
        toastIcon.className = 'fas fa-check-circle';
        
        toastMessage = document.createElement('span');
        toastMessage.id = 'toastMessage';
        toastMessage.textContent = 'Thông báo';
        
        toastContent.appendChild(toastIcon);
        toastContent.appendChild(toastMessage);
        toast.appendChild(toastContent);
        document.body.appendChild(toast);
    }
    
    if (!toastMessage) {
        toastMessage = toast.querySelector('#toastMessage') || toast.querySelector('span');
    }
    
    if (!toastMessage) {
        console.log(message); // Fallback to console if toast message element not found
        return;
    }
    
    // Find toast content container and icon
    const toastContent = toast.querySelector('.toast-content');
    let toastIcon = null;
    
    if (toastContent) {
        toastIcon = toastContent.querySelector('i');
    }
    
    // Set message
    toastMessage.textContent = message;
    
    // Set icon and color based on type
    const toastTypes = {
        success: { icon: 'fas fa-check-circle', color: '#34C759' },
        error: { icon: 'fas fa-exclamation-circle', color: '#FF3B30' },
        info: { icon: 'fas fa-info-circle', color: '#007AFF' },
        warning: { icon: 'fas fa-exclamation-triangle', color: '#FF9500' }
    };
    
    const toastType = toastTypes[type] || toastTypes.success;
    
    // Set icon safely
    if (toastIcon) {
        try {
            toastIcon.className = toastType.icon;
        } catch (e) {
            console.log('Could not set toast icon:', e);
        }
    }
    
    // Set background color safely
    try {
        toast.style.backgroundColor = toastType.color;
    } catch (e) {
        console.log('Could not set toast color:', e);
    }
    
    // Remove any existing timeout
    if (toast.hideTimeout) {
        clearTimeout(toast.hideTimeout);
    }
    
    // Show toast
    toast.classList.add('show');
    
    // Hide after 10 seconds
    toast.hideTimeout = setTimeout(() => {
        if (toast) {
            toast.classList.remove('show');
        }
    }, 10000);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.file-card, .about-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        observer.observe(el);
    });
});

// Add fadeInUp animation
const fadeInUpCSS = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
`;

// Add animation CSS
const animationStyle = document.createElement('style');
animationStyle.textContent = fadeInUpCSS;
document.head.appendChild(animationStyle);

// Handle file card interactions
document.addEventListener('click', (e) => {
    // Download button click effect
    if (e.target.closest('.download-btn')) {
        const btn = e.target.closest('.download-btn');
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 150);
    }
    
    // Share button click effect
    if (e.target.closest('.share-btn')) {
        const btn = e.target.closest('.share-btn');
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = 'scale(1)';
        }, 150);
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    // Press 's' to focus search
    if (e.key === 's' && !e.ctrlKey && !e.altKey && !e.shiftKey) {
        const activeElement = document.activeElement;
        if (activeElement.tagName !== 'INPUT' && activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            if (searchInput) {
                searchInput.focus();
            }
        }
    }
    
    // Press Escape to close mobile menu
    if (e.key === 'Escape') {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// Performance optimization - lazy load images
const lazyLoadImages = () => {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    lazyLoadImages();
    
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
    
    // Initialize admin functionality
    checkAdminAccess();
    updatePublicFiles();
    handleSharedFileAccess();
});

// Admin functionality
const ADMIN_PASSWORD = 'admin123'; // Change this to your desired password
let isLoggedIn = false;
let adminFiles = JSON.parse(localStorage.getItem('adminFiles')) || [];

// Check URL for admin access
function checkAdminAccess() {
    const adminSection = document.getElementById('admin');
    if (!adminSection) return;
    
    const currentPath = window.location.pathname + window.location.hash;
    
    // Always check if URL contains admin
    if (currentPath.includes('/admin') || window.location.hash === '#admin' || window.location.search.includes('admin')) {
        adminSection.style.display = 'block';
    } else {
        adminSection.style.display = 'none';
    }
}

// Handle shared file access
function handleSharedFileAccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const shareId = urlParams.get('share');
    
    if (shareId) {
        // Find the shared file
        const sharedFile = adminFiles.find(f => f.shareId === shareId);
        if (sharedFile) {
            // Highlight the file or show it in a special way
            setTimeout(() => {
                const fileCard = document.querySelector(`[data-file-id="${sharedFile.id}"]`);
                if (fileCard) {
                    fileCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    fileCard.style.border = '3px solid var(--primary-color)';
                    fileCard.style.boxShadow = '0 0 20px rgba(0, 122, 255, 0.3)';
                    showToast(`Đang xem: ${sharedFile.customTitle || sharedFile.name}`, 'info');
                }
            }, 1000);
        } else {
            showToast('File được share không tồn tại!', 'error');
        }
    }
}

// Listen for URL changes (for single page app behavior)
window.addEventListener('hashchange', checkAdminAccess);
window.addEventListener('popstate', checkAdminAccess);

function loginAdmin() {
    const passwordInput = document.getElementById('adminPassword');
    if (!passwordInput) return;
    
    const password = passwordInput.value;
    if (password === ADMIN_PASSWORD) {
        isLoggedIn = true;
        const adminLogin = document.getElementById('adminLogin');
        const adminPanel = document.getElementById('adminPanel');
        
        if (adminLogin) adminLogin.classList.add('hidden');
        if (adminPanel) adminPanel.classList.remove('hidden');
        
        showToast('Đăng nhập thành công!', 'success');
        loadAdminFiles();
        setupUploadListeners();
    } else {
        showToast('Mật khẩu không đúng!', 'error');
    }
}

function setupUploadListeners() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const selectFilesBtn = document.getElementById('selectFilesBtn');

    if (!uploadArea || !fileInput) {
        console.error('Upload elements not found');
        return;
    }

    // Drag and drop functionality
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = Array.from(e.dataTransfer.files);
        handleFileUpload(files);
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            handleFileUpload(files);
            // Clear input for next selection
            fileInput.value = '';
        }
    });

    // Click to select files - but prevent if clicking on the button itself
    uploadArea.addEventListener('click', (e) => {
        // Don't trigger if clicking on the button element
        if (!e.target.closest('button')) {
            fileInput.click();
        }
    });

    // Button click handler
    if (selectFilesBtn) {
        selectFilesBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            fileInput.click();
        });
    }
}

function handleFileUpload(files) {
    console.log('Handling file upload:', files.length, 'files');
    const uploadQueue = document.getElementById('uploadQueue');
    
    if (!uploadQueue) {
        console.error('Upload queue element not found');
        return;
    }
    
    if (files.length === 0) {
        showToast('Không có file nào được chọn!', 'warning');
        return;
    }
    
    // Show category selection modal for each file
    showCategorySelectionModal(files);
}

function showCategorySelectionModal(files) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('categoryModal');
    if (!modal) {
        modal = createCategoryModal();
        document.body.appendChild(modal);
    }
    
    const filesList = modal.querySelector('.files-list');
    const confirmBtn = modal.querySelector('.confirm-upload-btn');
    
    // Clear previous files
    filesList.innerHTML = '';
    
    // Create file items with category selection
    files.forEach((file, index) => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-selection-item';
        fileItem.innerHTML = `
            <div class="file-info">
                <i class="fas fa-file"></i>
                <span class="file-name">${file.name}</span>
                <span class="file-size">(${formatFileSize(file.size)})</span>
            </div>
            <div class="category-selection">
                <label class="category-option">
                    <input type="radio" name="category_${index}" value="apps" ${getFileCategory(file.name) === 'apps' ? 'checked' : ''}>
                    <span class="category-label">
                        <i class="fas fa-mobile-alt"></i>
                        App
                    </span>
                </label>
                <label class="category-option">
                    <input type="radio" name="category_${index}" value="games" ${getFileCategory(file.name) === 'games' ? 'checked' : ''}>
                    <span class="category-label">
                        <i class="fas fa-gamepad"></i>
                        Game
                    </span>
                </label>
            </div>
        `;
        filesList.appendChild(fileItem);
    });
    
    // Show modal
    modal.style.display = 'flex';
    
    // Handle confirm button
    confirmBtn.onclick = () => {
        const selectedCategories = [];
        files.forEach((file, index) => {
            const selectedRadio = modal.querySelector(`input[name="category_${index}"]:checked`);
            if (selectedRadio) {
                selectedCategories.push({
                    file: file,
                    category: selectedRadio.value
                });
            }
        });
        
        // Hide modal
        modal.style.display = 'none';
        
        // Process uploads with selected categories
        processFilesWithCategories(selectedCategories);
    };
    
    // Handle cancel button
    const cancelBtn = modal.querySelector('.cancel-upload-btn');
    cancelBtn.onclick = () => {
        modal.style.display = 'none';
    };
}

function createCategoryModal() {
    const modal = document.createElement('div');
    modal.id = 'categoryModal';
    modal.className = 'category-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Chọn loại file</h3>
                <p>Chọn category cho từng file trước khi upload</p>
            </div>
            <div class="modal-body">
                <div class="files-list"></div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary cancel-upload-btn">Hủy</button>
                <button class="btn btn-primary confirm-upload-btn">Xác nhận Upload</button>
            </div>
        </div>
    `;
    return modal;
}

function processFilesWithCategories(fileCategories) {
    const uploadQueue = document.getElementById('uploadQueue');
    if (!uploadQueue) return;
    
    fileCategories.forEach(({ file, category }) => {
        console.log('Processing file:', file.name, 'Category:', category);
        const uploadItem = createUploadItem(file);
        uploadQueue.appendChild(uploadItem);
        simulateUpload(file, uploadItem, category);
    });
}

function createUploadItem(file) {
    const uploadItem = document.createElement('div');
    uploadItem.className = 'upload-item';
    
    uploadItem.innerHTML = `
        <div class="upload-item-info">
            <h4>${file.name}</h4>
            <p>Kích thước: ${formatFileSize(file.size)}</p>
            <div class="upload-progress">
                <div class="upload-progress-bar" style="width: 0%"></div>
            </div>
        </div>
        <div class="upload-status uploading">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Đang tải...</span>
        </div>
    `;
    
    return uploadItem;
}

function simulateUpload(file, uploadItem, selectedCategory = null) {
    const progressBar = uploadItem.querySelector('.upload-progress-bar');
    const status = uploadItem.querySelector('.upload-status');
    let progress = 0;
    
    if (!progressBar || !status) {
        console.error('Upload progress elements not found');
        return;
    }
    
    const uploadInterval = setInterval(() => {
        progress += Math.random() * 15 + 5; // Faster progress
        if (progress >= 100) {
            progress = 100;
            clearInterval(uploadInterval);
            
            // Upload completed
            try {
                progressBar.style.width = '100%';
                status.className = 'upload-status success';
                status.innerHTML = `
                    <i class="fas fa-check"></i>
                    <span>Hoàn thành</span>
                `;
            } catch (e) {
                console.log('Error updating upload UI:', e);
            }
            
            // Create new file object and immediately publish it
            const newFile = {
                id: Date.now() + Math.random(),
                name: file.name,
                size: file.size,
                uploadDate: new Date().toISOString(),
                published: true, // Auto publish
                category: selectedCategory || getFileCategory(file.name),
                customTitle: file.name,
                shareId: null,
                shareUrl: null
            };
            
            // Add to admin files
            adminFiles.unshift(newFile); // Add to beginning of array
            
            try {
                localStorage.setItem('adminFiles', JSON.stringify(adminFiles));
            } catch (e) {
                console.error('Error saving to localStorage:', e);
            }
            
            // Update displays
            loadAdminFiles();
            updatePublicFiles();
            
            showToast(`Upload ${file.name} thành công và đã xuất bản!`, 'success');
            
            // Remove from queue after 2 seconds
            setTimeout(() => {
                try {
                    if (uploadItem && uploadItem.parentNode) {
                        uploadItem.remove();
                    }
                } catch (e) {
                    console.log('Error removing upload item:', e);
                }
            }, 2000);
        } else {
            try {
                progressBar.style.width = progress + '%';
            } catch (e) {
                console.log('Error updating progress:', e);
            }
        }
    }, 80);
}

function loadAdminFiles() {
    const adminFilesList = document.getElementById('adminFilesList');
    if (!adminFilesList) return;
    
    adminFilesList.innerHTML = '';
    
    if (adminFiles.length === 0) {
        adminFilesList.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.7);">Chưa có file nào được upload</p>';
        return;
    }
    
    adminFiles.forEach(file => {
        const fileItem = createAdminFileItem(file);
        adminFilesList.appendChild(fileItem);
    });
}

function createAdminFileItem(file) {
    const fileItem = document.createElement('div');
    fileItem.className = 'admin-file-item';
    
    const icon = file.name.includes('.ipa') ? 'fab fa-apple' : 'fas fa-file';
    const publishedBadge = file.published ? '<span style="color: #34C759; margin-left: 0.5rem;">(Đã xuất bản)</span>' : '';
    const displayTitle = file.customTitle || file.name;
    
    fileItem.innerHTML = `
        <div class="admin-file-info">
            <div class="admin-file-icon">
                <i class="${icon}"></i>
            </div>
            <div class="admin-file-details">
                <h4 class="file-title-display" onclick="editFileTitle(${file.id})">${displayTitle}${publishedBadge}</h4>
                <input type="text" class="file-title-edit hidden" value="${displayTitle}" onblur="saveFileTitle(${file.id}, this.value)" onkeypress="handleTitleKeypress(event, ${file.id}, this.value)">
                <p>${formatFileSize(file.size)} • ${formatDate(file.uploadDate)}</p>
                ${file.shareUrl ? `<p class="share-info"><i class="fas fa-link"></i> <span class="share-url">${file.shareUrl}</span></p>` : ''}
            </div>
        </div>
        <div class="admin-file-actions">
            <button class="edit-btn" onclick="editFileTitle(${file.id})" title="Chỉnh sửa tiêu đề">
                <i class="fas fa-edit"></i>
            </button>
            <button class="share-btn" onclick="generateShareLink(${file.id})" title="Tạo link share">
                <i class="fas fa-share-alt"></i>
            </button>
            <button class="publish-btn" onclick="togglePublishFile(${file.id})" title="${file.published ? 'Ẩn khỏi website' : 'Xuất bản lên website'}">
                <i class="fas ${file.published ? 'fa-eye-slash' : 'fa-eye'}"></i>
            </button>
            <button class="delete-btn" onclick="deleteAdminFile(${file.id})" title="Xóa file">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    return fileItem;
}

function togglePublishFile(fileId) {
    const file = adminFiles.find(f => f.id === fileId);
    if (file) {
        file.published = !file.published;
        localStorage.setItem('adminFiles', JSON.stringify(adminFiles));
        loadAdminFiles();
        updatePublicFiles();
        
        const action = file.published ? 'xuất bản' : 'ẩn';
        showToast(`Đã ${action} file ${file.name}`, 'success');
    }
}

function deleteAdminFile(fileId) {
    if (confirm('Bạn có chắc muốn xóa file này?')) {
        adminFiles = adminFiles.filter(f => f.id !== fileId);
        localStorage.setItem('adminFiles', JSON.stringify(adminFiles));
        loadAdminFiles();
        updatePublicFiles();
        showToast('Đã xóa file thành công!', 'success');
    }
}

function updatePublicFiles() {
    // Remove existing uploaded files first
    const existingUploadedFiles = document.querySelectorAll('.file-card[data-file-id]');
    existingUploadedFiles.forEach(card => card.remove());
    
    // Add published files to the public files grid
    const publishedFiles = adminFiles.filter(f => f.published);
    publishedFiles.forEach(file => {
        addPublicFileCard(file);
    });
    
    // Re-apply current filter
    setTimeout(() => {
        filterFiles();
    }, 100);
}

function addPublicFileCard(file) {
    const filesGrid = document.getElementById('filesGrid');
    if (!filesGrid) return;
    
    const fileCard = document.createElement('div');
    fileCard.className = 'file-card';
    fileCard.setAttribute('data-category', file.category);
    fileCard.setAttribute('data-file-id', file.id);
    
    const icon = file.category === 'apps' ? 'fab fa-apple' : 'fas fa-gamepad';
    const categoryTag = file.category === 'apps' ? 'apps' : 'games';
    const categoryName = file.category === 'apps' ? 'App' : 'Game';
    const displayTitle = file.customTitle || file.name;
    
    fileCard.innerHTML = `
        <div class="file-icon">
            <i class="${icon}"></i>
        </div>
        <div class="file-info">
            <h4>${displayTitle}</h4>
            <p>${formatFileSize(file.size)} • ${formatRelativeTime(file.uploadDate)}</p>
            <div class="file-stats">
                <span><i class="fas fa-download"></i> 0</span>
                <span><i class="fas fa-eye"></i> 0</span>
            </div>
            <div class="file-category">
                <span class="category-tag ${categoryTag}">${categoryName}</span>
            </div>
            ${file.shareUrl ? `<div class="share-link"><i class="fas fa-link"></i> <small>Có link share</small></div>` : ''}
        </div>
        <div class="file-actions">
            <button class="btn-action download-btn" onclick="downloadAdminFile('${displayTitle}')">
                <i class="fas fa-download"></i>
            </button>
            <button class="btn-action share-btn" onclick="shareFileByUrl('${file.shareUrl || ''}', '${displayTitle}')">
                <i class="fas fa-share"></i>
            </button>
        </div>
    `;
    
    // Insert at the beginning so new files appear first
    filesGrid.insertBefore(fileCard, filesGrid.firstChild);
}

function shareFileByUrl(shareUrl, fileName) {
    // Find the file to get its category
    let fileCategory = 'file';
    let categoryIcon = '📱';
    
    const file = adminFiles.find(f => (f.customTitle || f.name) === fileName);
    if (file) {
        if (file.category === 'apps') {
            fileCategory = 'App';
            categoryIcon = '📱';
        } else if (file.category === 'games') {
            fileCategory = 'Game';
            categoryIcon = '🎮';
        }
    }
    
    if (shareUrl) {
        if (navigator.share) {
            navigator.share({
                title: `Chia sẻ ${fileCategory} - ${fileName}`,
                text: `${categoryIcon} Tải ${fileCategory} "${fileName}" từ IPA Share`,
                url: shareUrl
            });
        } else {
            navigator.clipboard.writeText(shareUrl).then(() => {
                showToast(`Link share ${fileCategory.toLowerCase()} đã được copy!`, 'success');
            }).catch(() => {
                showToast('Không thể copy link!', 'error');
            });
        }
    } else {
        shareFile(fileName); // Fallback to original share function
    }
}

function downloadAdminFile(fileName) {
    showToast(`Đang tải ${fileName}...`, 'info');
    
    // Simulate download
    setTimeout(() => {
        showToast(`Tải ${fileName} thành công!`, 'success');
    }, 1000);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

function formatRelativeTime(dateString) {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 60) {
        return `${diffInMinutes} phút trước`;
    } else if (diffInMinutes < 1440) {
        return `${Math.floor(diffInMinutes / 60)} giờ trước`;
    } else {
        return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
    }
}

function getFileCategory(fileName) {
    const extension = fileName.toLowerCase().split('.').pop();
    
    // App files
    if (['ipa', 'apk', 'app', 'exe', 'msi', 'dmg', 'pkg'].includes(extension)) {
        return 'apps';
    }
    
    // Game files and game-related extensions
    if (['unity3d', 'unitypackage', 'obb', 'rom', 'iso'].includes(extension)) {
        return 'games';
    }
    
    // Check filename for game keywords
    const gameKeywords = ['game', 'mod', 'hack', 'cheat', 'trainer'];
    if (gameKeywords.some(keyword => fileName.toLowerCase().includes(keyword))) {
        return 'games';
    }
    
    // Default to apps for executable-like files, games for others
    return ['zip', 'rar', '7z', 'tar', 'gz'].includes(extension) ? 'games' : 'apps';
}

function editFileTitle(fileId) {
    const fileItem = document.querySelector(`[data-file-id="${fileId}"]`);
    if (!fileItem) {
        // Find admin file item
        const allItems = document.querySelectorAll('.admin-file-item');
        let targetItem = null;
        allItems.forEach(item => {
            if (item.innerHTML.includes(`editFileTitle(${fileId})`)) {
                targetItem = item;
            }
        });
        if (!targetItem) return;
        fileItem = targetItem;
    }
    
    const titleDisplay = fileItem.querySelector('.file-title-display');
    const titleEdit = fileItem.querySelector('.file-title-edit');
    
    if (titleDisplay && titleEdit) {
        titleDisplay.classList.add('hidden');
        titleEdit.classList.remove('hidden');
        titleEdit.focus();
        titleEdit.select();
    }
}

function saveFileTitle(fileId, newTitle) {
    const file = adminFiles.find(f => f.id === fileId);
    if (file && newTitle.trim()) {
        file.customTitle = newTitle.trim();
        localStorage.setItem('adminFiles', JSON.stringify(adminFiles));
        loadAdminFiles();
        updatePublicFiles();
        showToast('Đã cập nhật tiêu đề!', 'success');
    }
}

function handleTitleKeypress(event, fileId, value) {
    if (event.key === 'Enter') {
        event.target.blur();
        saveFileTitle(fileId, value);
    } else if (event.key === 'Escape') {
        loadAdminFiles(); // Reload to cancel edit
    }
}

function generateShareLink(fileId) {
    const file = adminFiles.find(f => f.id === fileId);
    if (file) {
        // Generate a unique share URL
        const shareId = `file_${fileId}_${Date.now()}`;
        const shareUrl = `${window.location.origin}${window.location.pathname}?share=${shareId}`;
        
        file.shareUrl = shareUrl;
        file.shareId = shareId;
        
        // Save to localStorage
        localStorage.setItem('adminFiles', JSON.stringify(adminFiles));
        
        // Determine category for toast message
        const fileCategory = file.category === 'apps' ? 'app' : 'game';
        const categoryIcon = file.category === 'apps' ? '📱' : '🎮';
        
        // Copy to clipboard
        navigator.clipboard.writeText(shareUrl).then(() => {
            showToast(`${categoryIcon} Link share ${fileCategory} đã được copy!`, 'success');
        }).catch(() => {
            showToast('Không thể copy link!', 'error');
        });
        
        loadAdminFiles();
        updatePublicFiles();
    }
}

// Handle online/offline status
window.addEventListener('online', () => {
    showToast('Đã kết nối internet!', 'success');
});

window.addEventListener('offline', () => {
    showToast('Mất kết nối internet!', 'warning');
});

// Theme preference (light/dark mode detection)
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
if (prefersDarkScheme.matches) {
    document.body.classList.add('dark-mode');
}

prefersDarkScheme.addEventListener('change', (e) => {
    if (e.matches) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
});
