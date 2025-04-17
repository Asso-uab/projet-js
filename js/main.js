/**
 * جمعية الأمل التنموية - الملف الرئيسي للجافاسكريبت
 * يحتوي على جميع الوظائف المستخدمة في الموقع
 */

// تهيئة الصفحة عند تحميلها
document.addEventListener('DOMContentLoaded', function() {
    // تفعيل القائمة المتجاوبة
    initMobileMenu();
    
    // تفعيل تأثيرات التمرير
    initScrollAnimations();
    
    // تفعيل شريط التقدم في الصفحة
    initScrollProgress();
    
    // تفعيل أزرار التصفية في صفحة الأنشطة
    if (document.querySelector('.activities-filter')) {
        initActivitiesFilter();
    }
    
    // تفعيل أزرار مبلغ التبرع في صفحة التبرعات
    if (document.querySelector('.donation-amount')) {
        initDonationAmountButtons();
    }
    
    // تفعيل الأسئلة الشائعة في صفحة التواصل
    if (document.querySelector('.faq-item')) {
        initFAQToggle();
    }
});

/**
 * تفعيل القائمة المتجاوبة للهواتف
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainMenu = document.querySelector('.main-menu');
    
    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', function() {
            mainMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
}

/**
 * تفعيل تأثيرات التمرير
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.scroll-animation');
    
    if (animatedElements.length > 0) {
        // دالة للتحقق من ظهور العنصر في نطاق الرؤية
        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
                rect.bottom >= 0
            );
        }
        
        // دالة لتفعيل التأثير عند التمرير
        function handleScroll() {
            animatedElements.forEach(element => {
                if (isElementInViewport(element) && !element.classList.contains('animated')) {
                    element.classList.add('animated');
                }
            });
        }
        
        // تفعيل التأثير عند تحميل الصفحة
        handleScroll();
        
        // تفعيل التأثير عند التمرير
        window.addEventListener('scroll', handleScroll);
    }
}

/**
 * تفعيل شريط التقدم في الصفحة
 */
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        
        progressBar.style.width = scrollPercentage + '%';
    });
}




/**
 * تفعيل أزرار التصفية في صفحة الأنشطة
 */
function initActivitiesFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const activityCards = document.querySelectorAll('.activity-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // إزالة الفئة النشطة من جميع الأزرار
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // إضافة الفئة النشطة للزر المحدد
            this.classList.add('active');
            
            // الحصول على فئة التصفية
            const filterCategory = this.getAttribute('data-category');
            
            // تصفية البطاقات
            activityCards.forEach(card => {
                if (filterCategory === 'all' || card.getAttribute('data-category') === filterCategory) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

/**
 * تفعيل أزرار مبلغ التبرع في صفحة التبرعات
 */
function initDonationAmountButtons() {
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.getElementById('custom-amount');
    
    if (amountButtons.length > 0 && customAmountInput) {
        amountButtons.forEach(button => {
            button.addEventListener('click', function() {
                // إزالة الفئة النشطة من جميع الأزرار
                amountButtons.forEach(btn => btn.classList.remove('active'));
                
                // إضافة الفئة النشطة للزر المحدد
                this.classList.add('active');
                
                // تحديث قيمة حقل المبلغ المخصص
                const amount = this.getAttribute('data-amount');
                customAmountInput.value = amount;
            });
        });
        
        // تحديث الزر النشط عند تغيير قيمة حقل المبلغ المخصص
        customAmountInput.addEventListener('input', function() {
            const value = this.value;
            
            // إزالة الفئة النشطة من جميع الأزرار
            amountButtons.forEach(button => {
                if (button.getAttribute('data-amount') === value) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            });
        });
    }
}

/**
 * تفعيل الأسئلة الشائعة في صفحة التواصل
 */
function initFAQToggle() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.toggle-icon i');
        
        question.addEventListener('click', function() {
            // إغلاق جميع الإجابات المفتوحة
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.querySelector('.faq-answer').style.display = 'none';
                    otherItem.querySelector('.toggle-icon i').className = 'fas fa-plus';
                }
            });
            
            // فتح/إغلاق الإجابة الحالية
            if (answer.style.display === 'block') {
                answer.style.display = 'none';
                icon.className = 'fas fa-plus';
            } else {
                answer.style.display = 'block';
                icon.className = 'fas fa-minus';
            }
        });
    });
}

/**
 * تهيئة خريطة Google Maps
 */
function initMap() {
    // التحقق من وجود عنصر الخريطة
    const mapElement = document.getElementById('map');
    
    if (mapElement) {
        // إحداثيات الموقع (يمكن تغييرها حسب موقع الجمعية)
        const location = { lat: 31.6295, lng: -7.9811 }; // مراكش، المغرب
        
        // إنشاء خريطة جديدة
        const map = new google.maps.Map(mapElement, {
            center: location,
            zoom: 15,
            styles: [
                {
                    "featureType": "all",
                    "elementType": "labels.text.fill",
                    "stylers": [{"color": "#7c93a3"}, {"lightness": "-10"}]
                },
                {
                    "featureType": "administrative.country",
                    "elementType": "geometry",
                    "stylers": [{"visibility": "on"}]
                },
                {
                    "featureType": "administrative.province",
                    "elementType": "geometry.stroke",
                    "stylers": [{"color": "#ffffff"}, {"visibility": "on"}, {"weight": 1}]
                },
                {
                    "featureType": "landscape",
                    "elementType": "geometry",
                    "stylers": [{"color": "#f5f5f5"}, {"lightness": 20}]
                },
                {
                    "featureType": "poi",
                    "elementType": "geometry",
                    "stylers": [{"color": "#efefef"}, {"lightness": 21}]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry.fill",
                    "stylers": [{"color": "#ffffff"}, {"lightness": 17}]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry.stroke",
                    "stylers": [{"color": "#ffffff"}, {"lightness": 29}, {"weight": 0.2}]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "geometry",
                    "stylers": [{"color": "#ffffff"}, {"lightness": 18}]
                },
                {
                    "featureType": "road.local",
                    "elementType": "geometry",
                    "stylers": [{"color": "#ffffff"}, {"lightness": 16}]
                },
                {
                    "featureType": "transit",
                    "elementType": "geometry",
                    "stylers": [{"color": "#f2f2f2"}, {"lightness": 19}]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [{"color": "#e9e9e9"}, {"lightness": 17}]
                }
            ]
        });
        
        // إضافة علامة على الخريطة
        const marker = new google.maps.Marker({
            position: location,
            map: map,
            title: 'جمعية الأمل التنموية',
            animation: google.maps.Animation.DROP
        });
        
        const infoWindow = new google.maps.InfoWindow({
            content: '<div class="map-info-window"><h3>جمعية الأمل التنموية</h3><p>شارع الأمل، حي السلام، المدينة</p></div>'
        });
        
        marker.addListener('click', function() {
            infoWindow.open(map, marker);
        });
    }
}


function validateContactForm() {
    const name = document.getElementById('contact-name');
    const email = document.getElementById('contact-email');
    const message = document.getElementById('contact-message');
    let isValid = true;
    
    if (!name.value.trim()) {
        alert('الرجاء إدخال الاسم الكامل');
        name.focus();
        isValid = false;
        return isValid;
    }
    
    if (!email.value.trim()) {
        alert('الرجاء إدخال البريد الإلكتروني');
        email.focus();
        isValid = false;
        return isValid;
    } else if (!isValidEmail(email.value)) {
        alert('الرجاء إدخال بريد إلكتروني صحيح');
        email.focus();
        isValid = false;
        return isValid;
    }
    
    if (!message.value.trim()) {
        alert('الرجاء إدخال نص الرسالة');
        message.focus();
        isValid = false;
        return isValid;
    }
    
    if (isValid) {
        alert('تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.');
    }
    
    return isValid;
}


function validateDonationForm() {
    const name = document.getElementById('donor-name');
    const email = document.getElementById('donor-email');
    const phone = document.getElementById('donor-phone');
    const amount = document.getElementById('custom-amount');
    let isValid = true;
    
    if (!name.value.trim()) {
        alert('الرجاء إدخال الاسم الكامل');
        name.focus();
        isValid = false;
        return isValid;
    }
    
    if (!email.value.trim()) {
        alert('الرجاء إدخال البريد الإلكتروني');
        email.focus();
        isValid = false;
        return isValid;
    } else if (!isValidEmail(email.value)) {
        alert('الرجاء إدخال بريد إلكتروني صحيح');
        email.focus();
        isValid = false;
        return isValid;
    }
    
    if (!phone.value.trim()) {
        alert('الرجاء إدخال رقم الهاتف');
        phone.focus();
        isValid = false;
        return isValid;
    }
    
    if (!amount.value.trim() || isNaN(amount.value) || amount.value <= 0) {
        alert('الرجاء إدخال مبلغ تبرع صحيح');
        amount.focus();
        isValid = false;
        return isValid;
    }
    
    if (isValid) {
        alert('تم تسجيل تبرعك بنجاح. شكراً لدعمك لجمعية الأمل التنموية.');
    }
    
    return isValid;
}


function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}


function initCounters() {
    const counters = document.querySelectorAll('.counter');
    
    if (counters.length > 0) {
        function isElementInViewport(el) {
            const rect = el.getBoundingClientRect();
            return (
                rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.bottom >= 0
            );
        }
        
        function startCounting() {
            counters.forEach(counter => {
                if (isElementInViewport(counter) && !counter.classList.contains('counted')) {
                    counter.classList.add('counted');
                    
                    const target = parseInt(counter.getAttribute('data-count'));
                    const duration = 2000; 
                    const step = Math.ceil(target / (duration / 20)); 
                    
                    let current = 0;
                    const timer = setInterval(() => {
                        current += step;
                        
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        
                        counter.textContent = current.toLocaleString();
                    }, 20);
                }
            });
        }
        
        startCounting();
        
        window.addEventListener('scroll', startCounting);
    }
}


function initSearchBar() {
    const searchIcon = document.querySelector('.search-icon');
    const searchBar = document.querySelector('.search-bar');
    
    if (searchIcon && searchBar) {
        searchIcon.addEventListener('click', function() {
            searchBar.classList.toggle('active');
            
            if (searchBar.classList.contains('active')) {
                searchBar.querySelector('input').focus();
            }
        });
        
        document.addEventListener('click', function(e) {
            if (!searchBar.contains(e.target) && !searchIcon.contains(e.target) && searchBar.classList.contains('active')) {
                searchBar.classList.remove('active');
            }
        });
    }
}


function initBackToTop() {
    const backToTopButton = document.createElement('button');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTopButton);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('active');
        } else {
            backToTopButton.classList.remove('active');
        }
    });
    
    backToTopButton.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}


function initStickyHeader() {
    const header = document.querySelector('header');
    const headerHeight = header.offsetHeight;
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > headerHeight) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });
}


function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    if (galleryItems.length > 0) {
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="close">&times;</span>
                <img class="lightbox-image" src="" alt="صورة مكبرة">
                <div class="lightbox-caption"></div>
                <div class="lightbox-controls">
                    <button class="prev-btn"><i class="fas fa-chevron-left"></i></button>
                    <button class="next-btn"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
        `;
        document.body.appendChild(lightbox);
        
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        const closeButton = lightbox.querySelector('.close');
        const prevButton = lightbox.querySelector('.prev-btn');
        const nextButton = lightbox.querySelector('.next-btn');
        
        let currentIndex = 0;
        
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', function() {
                currentIndex = index;
                const imgSrc = this.querySelector('img').getAttribute('src');
                const imgCaption = this.querySelector('img').getAttribute('alt');
                
                lightboxImage.setAttribute('src', imgSrc);
                lightboxCaption.textContent = imgCaption;
                lightbox.style.display = 'flex';
                
                document.body.style.overflow = 'hidden';
            });
        });
        
        closeButton.addEventListener('click', function() {
            lightbox.style.display = 'none';
            
            document.body.style.overflow = 'auto';
        });
        
        
        prevButton.addEventListener('click', function() {
            currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
            const imgSrc = galleryItems[currentIndex].querySelector('img').getAttribute('src');
            const imgCaption = galleryItems[currentIndex].querySelector('img').getAttribute('alt');
            
            lightboxImage.setAttribute('src', imgSrc);
            lightboxCaption.textContent = imgCaption;
        });
        
        
        nextButton.addEventListener('click', function() {
            currentIndex = (currentIndex + 1) % galleryItems.length;
            const imgSrc = galleryItems[currentIndex].querySelector('img').getAttribute('src');
            const imgCaption = galleryItems[currentIndex].querySelector('img').getAttribute('alt');
            
            lightboxImage.setAttribute('src', imgSrc);
            lightboxCaption.textContent = imgCaption;
        });
        
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
                
                document.body.style.overflow = 'auto';
            }
        });
        
        document.addEventListener('keydown', function(e) {
            if (lightbox.style.display === 'flex') {
                if (e.key === 'ArrowLeft') {
                    prevButton.click();
                } else if (e.key === 'ArrowRight') {
                    nextButton.click();
                } else if (e.key === 'Escape') {
                    closeButton.click();
                }
            }
        });
    }
}
// --------------------------   
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

function setTheme(mode) {
  if (mode === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
  } else {
    document.body.classList.remove('dark-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  }
  sessionStorage.setItem('theme', mode);
}

themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark-mode');
  setTheme(isDark ? 'light' : 'dark');
});

window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = sessionStorage.getItem('theme') || 'light';
  setTheme(savedTheme);
});



// ----------------------------------

document.addEventListener('DOMContentLoaded', function() {
    
    initSmoothScroll();
    initCounters();
    initSearchBar();
    initBackToTop();
    initStickyHeader();
    initGallery();
    darckm();
});