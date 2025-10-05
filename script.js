class AuthService {
  static #KEY = 'se_travel_users';
  static #SESSION_KEY = 'se_travel_session';

  static #readUsers = () => JSON.parse(localStorage.getItem(AuthService.#KEY) || '[]');
  static #writeUsers = (arr) => localStorage.setItem(AuthService.#KEY, JSON.stringify(arr));

  static register = ({ firstName, lastName, email, password, phone, role }) => {
    const users = this.#readUsers();
    if (users.find(u => u.email === email)) {
      throw new Error('This email is used');
    }
    const user = { 
      id: crypto.randomUUID(), 
      firstName, 
      lastName, 
      email, 
      password, 
      phone, 
      role, 
      createdAt: Date.now() 
    };
    users.push(user);
    this.#writeUsers(users);
    this.#createSession(user);
    return user;
  }

  static login = ({ email, password, remember }) => {
    const users = this.#readUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) throw new Error('The emial or password is wrong!');
    this.#createSession(user, remember);
    return user;
  }

  static #createSession(user, remember=false){
    const payload = { 
      id:user.id, 
      email:user.email, 
      name:`${user.firstName} ${user.lastName}` 
    };
    const data = { 
      payload, 
      expiresAt: remember ? Date.now()+ (1000*60*60*24*30) : Date.now()+ (1000*60*60*2) 
    };
    localStorage.setItem(this.#SESSION_KEY, JSON.stringify(data));
  }

 static currentUser(){
    const raw = localStorage.getItem(this.#SESSION_KEY);
    if(!raw) return null;

    const data = JSON.parse(raw);

    // لو الجلسة انتهت
    if(Date.now() > data.expiresAt){
      localStorage.removeItem(this.#SESSION_KEY);
      return null;
    }

    // نجيب اليوزر من القائمة
    const users = this.#readUsers();
    const fullUser = users.find(u => u.id === data.payload.id);

    if (fullUser) {
        // نرجع بيانات كاملة بالاسم الأول والأخير والرقم إلخ
        return {
            id: fullUser.id,
            firstName: fullUser.firstName,
            lastName: fullUser.lastName,
            email: fullUser.email,
            phone: fullUser.phone,
            role: fullUser.role,
            name: `${fullUser.firstName} ${fullUser.lastName}` // عشان التوافق
        };
    }

    return data.payload; // fallback لو حصلت مشكلة
}

}


const $ = (sel, el=document) => el.querySelector(sel);


const bindToggle = (btnId, inputId) => {
  const btn = document.getElementById(btnId);
  const input = document.getElementById(inputId);
  if (!btn || !input) return;
  btn.addEventListener('click', () => {
    input.type = input.type === 'password' ? 'text' : 'password';
    btn.firstElementChild.classList.toggle('bi-eye');
    btn.firstElementChild.classList.toggle('bi-eye-slash');
  });
}

bindToggle('toggleLoginPass', 'loginPassword');
bindToggle('toggleRegPass', 'regPassword');


const strengthBar = document.getElementById('strengthBar');
const calcStrength = (v) => {
  let score = 0;
  if (v.length >= 8) score += 25;
  if (/[A-Z]/.test(v)) score += 20;
  if (/[a-z]/.test(v)) score += 20;
  if (/[0-9]/.test(v)) score += 20;
  if (/[^A-Za-z0-9]/.test(v)) score += 15;
  return Math.min(score, 100);
};
const regPassEl = $('#regPassword');
if (regPassEl && strengthBar) {
  regPassEl.addEventListener('input', (e)=>{
    const val = e.target.value;
    const s = calcStrength(val);
    strengthBar.style.width = s+'%';
    strengthBar.className = 'progress-bar ' + (s<40? 'bg-danger' : s<70? 'bg-warning' : 'bg-success');
  });
}


const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');


const confirmInput = document.getElementById('confirmPassword');
if (confirmInput) {
  confirmInput.addEventListener('input', ()=>{
    const regVal = $('#regPassword') ? $('#regPassword').value : '';
    confirmInput.setCustomValidity(confirmInput.value === regVal ? '' : 'not-match');
  });
}


Array.from(document.querySelectorAll('.needs-validation')).forEach(form=>{
  form.addEventListener('submit', (event)=>{
    if(!form.checkValidity()){
      event.preventDefault();
      event.stopPropagation();
    }
    form.classList.add('was-validated');
  }, false);
});


if (registerForm) {
  registerForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(!registerForm.checkValidity()) return;
    const payload = {
      firstName: $('#firstName').value.trim(),
      lastName:  $('#lastName').value.trim(),
      email:     $('#regEmail').value.trim().toLowerCase(),
      password:  $('#regPassword').value,
      phone:     $('#phone').value.trim(),
      role:      $('#role') ? $('#role').value : 'user'
    };
    try{
      const u = AuthService.register(payload);
      showToast(` welcom ,${u.firstName}!`);
      
      // نخزن بيانات اليوزر
      localStorage.setItem("userName", `${u.firstName} ${u.lastName}`);
      localStorage.setItem("userEmail", u.email);

      // بعد التسجيل روح للهوم
      setTimeout(()=> window.location.href = 'index.html', 1000);

    }catch(err){
      showToast(err.message, 'danger');
    }
  });
}


if (loginForm) {
  loginForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    if(!loginForm.checkValidity()) return;
    const remember = document.getElementById('rememberMe').checked;
    try{
      const u = AuthService.login({
        email: $('#loginEmail').value.trim().toLowerCase(),
        password: $('#loginPassword').value,
        remember
      });
      showToast(`Welcome ${u.firstName} ${u.lastName}`);
      
      // نخزن بيانات اليوزر
      localStorage.setItem("userName", `${u.firstName} ${u.lastName}`);
      localStorage.setItem("userEmail", u.email);
      localStorage.setItem("loggedIn" ,true);

      // بعد اللوجين روح للهوم
      setTimeout(()=> window.location.href = 'index.html', 1000);

    }catch(err){
      showToast(err.message, 'danger');
    }
  });
}


const showToast = (msg, type='success')=>{
  const wrap = document.createElement('div');
  wrap.innerHTML = `
    <div class="toast align-items-center text-bg-${type} border-0 position-fixed bottom-0 start-0 m-4" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">${msg}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>`;
  document.body.appendChild(wrap.firstElementChild);
  const t = new bootstrap.Toast(document.body.lastElementChild, { delay: 2500 });
  t.show();
  setTimeout(()=>document.body.lastElementChild?.remove(), 2800);
}
