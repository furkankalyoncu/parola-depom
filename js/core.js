getCookie = (name = 'paroladepom') => {
    const getCookie = Cookies.get(name)
    let data = []
    getCookie !== undefined ? data = JSON.parse(getCookie) : false
    return data || [{}]
}

findPlatform = (platform) => {
    const data = getCookie()
    return data.find(d => d.platform == platform) || false
}

findById = (id) => {
    const data = getCookie()
    return data.find(d => d.id == id) || false
}

getRandomId = (min = 112111, max = 999999) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    const num = Math.floor(Math.random() * (max - min + 1) + min);
    if (findById(num)) {
        getRandomId()
    } else {
        return num
    }
}

setCookie = (value, name = 'paroladepom') => {
    let id = getRandomId()
    var currentCookies = getCookie()
    value = { "id": id, "platform": value.platform, "name": value.name, "password": value.password }
    currentCookies.push(value)
    Cookies.set(name, currentCookies, { expires: 3500 })
}

deleteCookie = (id, name = 'paroladepom') => {
    let intId = parseInt(id, 10)
    let currentCookies = getCookie()
    let record = currentCookies.find(d => d.id === intId)
    Swal.fire({
        title: 'Emin misin?',
        text: `${record.platform} kaydı emrinle silinecek. Cümle alem toplansa geri getiremez bir daha.`,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Evet',
        cancelButtonText: 'Hayır'
    }).then((result) => {
        if (result.value === true) {
            currentCookies.splice(currentCookies.findIndex(function (i) {
                return i.id === intId;
            }), 1);
            Cookies.set(name, currentCookies, { expires: 3500 })
            listAll()
            Swal.fire(
                'Silindi',
                'Patron sensin.',
                'success'
            )
        }
    })
}

listAll = () => {
    const data = getCookie()
    var list = $('#list')
    list.html('')
    if (data.length > 0) {
        for (let i = 0; i < data.length; i++) {
            list.append(`<div class="max-w-sm mx-auto inline-flex">
        <div class="flex flex-col">
            <div class="bg-white border border-white shadow-lg  rounded-3xl p-4 m-4">
                <div class="flex-none sm:flex">
                    <div class="flex-auto sm:ml-5 justify-evenly">
                        <div class="flex items-center justify-between sm:mt-2">
                            <div class="flex items-center">
                                <div class="flex flex-col">
                                    <div
                                        class="w-full flex-none text-lg text-gray-800 font-bold leading-none pb-3 flex">
                                        ${data[i].platform}
                                        <div class="pl-3" id="delete" name="delete_${data[i].id}"><svg
                                                xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 cursor-pointer"
                                                fill="none" viewBox="0 0 26 26" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h3 class="font-medium">Kullanıcı Adı</h3>
                        <p class="contents" id="username_${data[i].id}">${data[i].name}</p>
                        <div id="copy" name="copy_${data[i].id}_name" class="contents">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline-block cursor-pointer"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        </div>
                        <div>
                            <h3 class="font-medium">Parola</h3>
                            <p class="contents" id="password_${data[i].id}">${data[i].password}</p>
                            <div id="copy" name="copy_${data[i].id}_password" class="contents">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline-block cursor-pointer"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`)
        }
    } else {
        list.append(`<ul class="flex flex-wrap flex-col justify-center items-center m-auto subpixel-antialiased">
        <li>Uyarılar eklenecek</li>
        <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
        <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
        <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
        <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit</li>
      </ul>`)
    }
}