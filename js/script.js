window.addEventListener('DOMContentLoaded', () => {

    const navbar = document.querySelector('.header .navbar');

    document.querySelector('#menu-btn').onclick = () => {
        navbar.classList.toggle('active');
    }
    document.querySelectorAll('.about .video-container .controls .control-btn').forEach(btn => {
        btn.onclick = () => {
            let src = btn.getAttribute('data-src');
            document.querySelector('.about .video-container .video').src = src;
        }
    });

    // Modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal')

    function closeModal() {
        modal.classList.add('hide')
        modal.classList.remove('show')
        document.body.style.overflow = ''
    }

    function openModal() {
        modal.classList.add('show')
        modal.classList.remove('hide')
        document.body.style.overflow = 'hidden'
        clearInterval(modalTimerId)
    }

    modalTrigger.forEach((item) => {
        item.addEventListener('click', openModal)
    })

    modal.addEventListener('click', (e) => {
        if (e.target == modal || e.target.getAttribute('data-close') == '') {
            closeModal()
        }
    })

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            closeModal()
        }
    })

    const modalTimerId = setTimeout(openModal, 5000)

    // Class
    class TravelCard {
        constructor(src, alt, title, desc, button, parentSelector) {
            this.src = src
            this.alt = alt
            this.title = title
            this.desc = desc
            this.button = button
            this.parent = document.querySelector(parentSelector)
        }

        render() {
            const element = document.createElement('div')

            element.innerHTML = `
                <div class="box" data-aos="fade-up" data-aos-delay="150">
                    <div class="image">
                        <img src=${this.src} alt=${this.alt}>
                    </div>
                        <div class="content">
                        <h3 class="title">${this.title}</h3>
                        <p class="desc">${this.desc}</p>
                        <a class="button" href="#">${this.button}<i class="fas fa-angle-right"></i></a>
                    </div>
                </div>
            `

            this.parent.append(element)
        }
    }

    async function getRecource(url) {
        const res = await fetch(url)

        return await res.json()
    }

    getRecource('http://localhost:3000/menu').then((data) => {
        data.forEach(({img, altimg, title, desc, button}) => {
            new TravelCard(img, altimg, title, desc, button, '.destination .box-container').render()
        })
    })

    // Form
    const forms = document.querySelectorAll('form')

    forms.forEach((form) => {
        bindPostData(form)
    })

    const msg = {
        loading: 'images/spinner.svg',
        success: "Thank's for submitting our form",
        failure: 'Something went wrong',
    }

    async function postData(url, data) {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data,
        })

        return await res.json()
    }

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault()

            const statusMessage = document.createElement('img')
            statusMessage.src = msg.loading
            statusMessage.style.cssText = `
            display: block;
            margin: 0 auto;
        `
            form.insertAdjacentElement('afterend', statusMessage)

            const formData = new FormData(form)

            const json = JSON.stringify(Object.fromEntries(formData.entries()))

            postData('http://localhost:3000/request', json)
                .then((data) => {
                    console.log(data)
                    showThanksModal(msg.success)
                    statusMessage.remove()
                })
                .catch(() => {
                    showThanksModal(msg.failure)
                })
                .finally(() => {
                    form.reset()
                })
        })
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog')

        prevModalDialog.classList.add('hide')
        openModal()

        const thanksModal = document.createElement('div')
        thanksModal.classList.add('modal__dialog')
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div data-close class="modal__close">&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `

        document.querySelector('.modal').append(thanksModal)
        setTimeout(() => {
            thanksModal.remove()
            prevModalDialog.classList.add('show')
            prevModalDialog.classList.remove('hide')
            closeModal()
        }, 4000)
    }




    // Read more new window
    // function openIt() {
    //     const url = "http://127.0.0.1:5500/read_more.html";
    //     window.open(url);
    // };

    // Swiper
    // const counter = 1;
    // setInterval(function () {
    //     document.getElementById('radio' + counter).checked = true;
    //     counter++;
    //     if (counter > 8) {
    //         counter = 1;
    //     }
    // }, 5000);

})