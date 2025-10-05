
function checkLoginStatus() {
    const authSection = document.getElementById('authSection');
    if (!authSection) return;
    
    // استخدام AuthService.currentUser() بدلاً من localStorage مباشرة
    const user = AuthService.currentUser();
    
    if (user) {
        // المستخدم مسجل دخول - أظهر اسمه وزر Logout
        const displayName = user.name || `${user.firstName} ${user.lastName}` || user.email;
        
        authSection.innerHTML = `
            <div class="d-flex align-items-center gap-2">
                <span class="text-white fw-bold">
                    <i class="fas fa-user-circle"></i> ًWelcom ${displayName}
                </span>
                <button class="btn btn-outline-danger btn-sm" onclick="logout()">
                    <i class="fas fa-sign-out-alt"></i> Logout
                </button>
            </div>
        `;
    } else {
        // المستخدم غير مسجل - أظهر زر Login
        authSection.innerHTML = `
            <a href="login.html" class="btn btn-outline-light btn-sm">
                <i class="fas fa-sign-in-alt"></i> Login
            </a>
        `;
    }
}

// دالة تسجيل الخروج
function logout() {
    if (confirm('Do you want to log out?')) {
        // حذف الـ session من localStorage
        localStorage.removeItem('se_travel_session');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('loggedIn');
        
        // عرض رسالة
        if (typeof showToast === 'function') {
            showToast('Logged out successfully', 'info');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } else {
            window.location.href = 'index.html';
        }
    }
}

// تشغيل الدالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', checkLoginStatus);

// تحديث حالة Auth عند تغيير localStorage
window.addEventListener('storage', function(e) {
    if (e.key === 'se_travel_session') {
        checkLoginStatus();
    }
});