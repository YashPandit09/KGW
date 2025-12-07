// Check if user is logged in
function checkLoginStatus() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    return { isLoggedIn: !!token && !!user, user };
}

// Update navigation based on login status
function updateNavigation() {
    const { isLoggedIn, user } = checkLoginStatus();
    const navLinks = document.querySelectorAll('.nav-links');
    
    navLinks.forEach(nav => {
        const loginLink = nav.querySelector('a[href="login.html"]');
        if (loginLink) {
            if (isLoggedIn) {
                loginLink.textContent = 'Profile';
                loginLink.href = 'profile.html';
                
                // Create logout button if it doesn't exist
                if (!nav.querySelector('.logout-btn')) {
                    const logoutBtn = document.createElement('a');
                    logoutBtn.href = '#';
                    logoutBtn.className = 'logout-btn';
                    logoutBtn.textContent = 'Logout';
                    logoutBtn.addEventListener('click', function(e) {
                        e.preventDefault();
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.href = 'FrontPage.html';
                    });
                    nav.appendChild(logoutBtn);
                }
                
                // Add admin panel link if user is admin
                if (user && user.role === 'admin' && !nav.querySelector('a[href="admin.html"]')) {
                    const adminLink = document.createElement('a');
                    adminLink.href = 'admin.html';
                    adminLink.textContent = 'Admin';
                    loginLink.parentNode.insertBefore(adminLink, loginLink);
                }
            } else {
                loginLink.textContent = 'Login';
                loginLink.href = 'login.html';
                
                // Remove logout button if it exists
                const logoutBtn = nav.querySelector('.logout-btn');
                if (logoutBtn) {
                    nav.removeChild(logoutBtn);
                }
                
                // Remove admin link if it exists
                const adminLink = nav.querySelector('a[href="admin.html"]');
                if (adminLink) {
                    nav.removeChild(adminLink);
                }
            }
        }
    });
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'FrontPage.html';
}

// Initialize authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    updateNavigation();
}); 