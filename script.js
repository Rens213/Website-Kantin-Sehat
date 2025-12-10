// Fungsi untuk Login dan Register
document.addEventListener('DOMContentLoaded', function() {
    // Login Form
    const loginForm = document.getElementById('loginForm');
    const backToLogin = document.getElementById('backToLogin');
    const loginFormContainer = document.querySelector('.login-form');
    
    // Login functionality
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Validasi input
            if (!username || !password) {
                alert('Username dan password harus diisi!');
                return;
            }
            
            // Check credentials in localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.username === username && u.password === password);
            
            if (!user) {
                alert('Username atau password salah!');
                return;
            }
            
            // Simpan user ke localStorage
            localStorage.setItem('currentUser', username);
            
            // Redirect ke halaman menu
            window.location.href = 'menu.html';
        });
    }
    
    // Toggle between login and register forms
    if (registerLink && loginFormContainer && registerForm) {
        registerLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginFormContainer.style.display = 'none';
            registerForm.style.display = 'block';
        });
    }
    
    if (backToLogin && loginFormContainer && registerForm) {
        backToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            registerForm.style.display = 'none';
            loginFormContainer.style.display = 'block';
        });
    }
    
    // Register Form
    const registerFormContent = document.getElementById('registerFormContent');
    if (registerFormContent) {
        registerFormContent.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('regUsername').value;
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;
            
            // Validasi input
            if (!username || !password || !confirmPassword) {
                alert('Semua field harus diisi!');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('Password dan konfirmasi password tidak cocok!');
                return;
            }
            
            if (password.length < 6) {
                alert('Password minimal 6 karakter!');
                return;
            }
            
            // Check if username already exists
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const existingUser = users.find(u => u.username === username);
            
            if (existingUser) {
                alert('Username sudah digunakan!');
                return;
            }
            
            // Simpan user baru
            users.push({username, password});
            localStorage.setItem('users', JSON.stringify(users));
            
            alert('Registrasi berhasil! Silakan login.');
            
            // Kembali ke form login
            if (registerForm && loginFormContainer) {
                registerForm.style.display = 'none';
                loginFormContainer.style.display = 'block';
            }
            
            // Reset form
            registerFormContent.reset();
        });
    }
    
    // Menu Page Functionality
    const selectButtons = document.querySelectorAll('.btn-select');
    const selectedCountElement = document.getElementById('selectedCount');
    const proceedBtn = document.getElementById('proceedBtn');
    
    if (selectButtons.length > 0) {
        // Load selected products from localStorage
        let selectedProducts = JSON.parse(localStorage.getItem('selectedProducts') || '[]');
        updateSelectedCount();
        
        selectButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                const productName = this.getAttribute('data-name');
                const productPrice = parseInt(this.getAttribute('data-price'));
                
                // Check if product is already selected
                const existingIndex = selectedProducts.findIndex(p => p.id === productId);
                
                if (existingIndex >= 0) {
                    // Remove product if already selected
                    selectedProducts.splice(existingIndex, 1);
                    this.innerHTML = '<i class="fas fa-cart-plus"></i> Pilih';
                    this.style.backgroundColor = '#4CAF50';
                } else {
                    // Add product if not selected
                    selectedProducts.push({
                        id: productId,
                        name: productName,
                        price: productPrice,
                        quantity: 1
                    });
                    this.innerHTML = '<i class="fas fa-check"></i> Dipilih';
                    this.style.backgroundColor = '#388E3C';
                }
                
                // Save to localStorage
                localStorage.setItem('selectedProducts', JSON.stringify(selectedProducts));
                updateSelectedCount();
            });
            
            // Check if product is already selected
            const productId = button.getAttribute('data-id');
            const isSelected = selectedProducts.some(p => p.id === productId);
            
            if (isSelected) {
                button.innerHTML = '<i class="fas fa-check"></i> Dipilih';
                button.style.backgroundColor = '#388E3C';
            }
        });
        
        function updateSelectedCount() {
            if (selectedCountElement) {
                selectedCountElement.textContent = selectedProducts.length;
                
                // Enable/disable proceed button
                if (proceedBtn) {
                    if (selectedProducts.length > 0) {
                        proceedBtn.classList.remove('disabled');
                        proceedBtn.disabled = false;
                    } else {
                        proceedBtn.classList.add('disabled');
                        proceedBtn.disabled = true;
                    }
                }
            }
        }
        
        // Handle proceed button
        if (proceedBtn) {
            proceedBtn.addEventListener('click', function() {
                // Check if button is disabled
                if (this.classList.contains('disabled') || this.disabled) {
                    return;
                }
                
                // Redirect to payment page or next step
                const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts') || '[]');
                
                if (selectedProducts.length === 0) {
                    alert('Silakan pilih setidaknya satu produk terlebih dahulu!');
                    return;
                }
                
                // Redirect to payment/checkout page
                window.location.href = 'checkout.html';
                // Atau ke halaman lain sesuai kebutuhan
                // window.location.href = 'payment.html';
            });
        }
    }
    
    // Logout functionality (if logout button exists)
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        });
    }
    
    // Check authentication on protected pages
    const protectedPages = ['menu.html', 'checkout.html']; // Add your protected pages
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
            alert('Anda harus login terlebih dahulu!');
            window.location.href = 'index.html';
        }
    }
});