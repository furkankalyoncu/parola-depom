getCookie = (name = 'paroladepom') => {
    const getCookie = Cookies.get(name)
    const getLocalStorage = localStorage.getItem(name)
    let data = []
    getLocalStorage !== '' ? data = JSON.parse(getLocalStorage) : false
    return data || []
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
        return getRandomId()
    } else {
        return num
    }
}

setCookie = (value, name = 'paroladepom') => {
    let id = getRandomId();
    var currentCookies = getCookie();
    let newValue = { "id": id, "platform": value.platform, "name": value.name, "password": value.password };
    typeof value.url != undefined ? newValue.url = value.url : {};
    currentCookies.push(newValue);
    localStorage.setItem(name, JSON.stringify(currentCookies));
    // Cookies.set(name, currentCookies, { expires: 3500, secure: true });
}

deleteCookie = (id, name = 'paroladepom') => {
    let intId = parseInt(id, 10)
    let currentCookies = getCookie()
    let record = currentCookies.find(d => d.id === intId) || ''
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
            localStorage.setItem(name, JSON.stringify(currentCookies));
            listAll()
            handlePreferences()
            Swal.fire(
                'Silindi',
                'Patron sensin.',
                'success'
            )
        }
    })
}

editCookie = (id, data) => {
    let currentCookies = getCookie();
    let intId = parseInt(id, 10);
    let objIndex = currentCookies.findIndex((d => d.id == intId));
    currentCookies[objIndex].platform = data.platform;
    currentCookies[objIndex].name = data.name;
    currentCookies[objIndex].password = data.password;
    typeof currentCookies[objIndex].url != undefined ? currentCookies[objIndex].url = data.url : {};
    // Cookies.set('paroladepom', currentCookies, { expires: 3500, secure: true });
    localStorage.setItem('paroladepom', JSON.stringify(currentCookies));
}

savePreferences = (form, name = 'paroladepom_preferences') => {
    const formData = $(form).serializeArray()
    Cookies.set(name, formData, { expires: 3500, secure: true })
    modalClose('main-modal')
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
    })
    Toast.fire({
        type: 'success',
        title: 'Kaydedildi'
    })
    handlePreferences()
}

now = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hh = String(today.getHours()).padStart(2, '0');
    var min = String(today.getMinutes()).padStart(2, '0');
    return dd + '-' + mm + '-' + yyyy + ' ' + hh + '.' + min;
}

getBackup = () => {
    const data = JSON.stringify(getCookie())
    var blob = new Blob([data], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `Parola Depom Yedek ${now()}.txt`);
    return true
}

uploadBackup = () => {
    const [file] = document.querySelector('input[type=file]').files;
    const reader = new FileReader();

    reader.addEventListener("load", () => {
        // Cookies.set('paroladepom', reader.result, { expires: 3500, secure: true })
        localStorage.setItem('paroladepom', reader.result)
        listAll()
        handlePreferences()
        $('#uploadBackupInput').val('İşlem tamam')
        $('#uploadBackupInput').css('background-color', '#059905')
    }, false);

    if (file) {
        reader.readAsText(file)
    }
}

// if any key is pressed 
$('#default-search').on('keyup', function (e) {
    const data = getCookie()
    const filteredData = data.filter(d => d.platform.toLowerCase().includes(e.target.value.toLowerCase()))
    console.log('search data', filteredData,);
    listAll(filteredData, 'search')
    handlePreferences();
});

listAll = (data = getCookie(), listType = 'default') => {
    var list = $('#list')
    list.html('')
    if (data.length > 0) {
        document.getElementById('not-found').style.display = 'none';
        list.removeAttr("style")
        for (let i = 0; i < data.length; i++) {
            raw = `<div class="max-w-sm mx-auto inline-flex">
            <div class="flex flex-col">
                <div class="bg-white border border-white shadow-lg rounded-3xl p-4 m-4" style="width: 16rem;">
                    <div class="flex-none sm:flex">
                        <div class="flex-auto sm:ml-5 justify-evenly" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            <div class="items-center sm:mt-2">
                                <div class="items-center">
                                    <div class="flex justify-between">
                                        <div
                                            class="text-lg text-gray-800 font-bold leading-none pb-3 whitespace-normal" style="word-break: break-word;">
                                            ${data[i].platform}  
                                        </div>
                                        <div class="flex">
                                        <div class="pl-1" id="edit" name="edit_${data[i].id}"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 cursor-pointer" fill="none" viewBox="0 0 28 28" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg></div>
                                    <div id="delete" name="delete_${data[i].id}"><svg
                                            xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 cursor-pointer"
                                            fill="none" viewBox="0 0 28 28" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="pb-2">
                            <h3 class="font-medium" id="username_h3">Kullanıcı</h3>
                            <p class="contents break-words whitespace-normal" id="username_${data[i].id}">${data[i].name}</p>
                            <div id="copy" name="copy_${data[i].id}_name" class="contents">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline-block cursor-pointer"
                                fill="none" viewBox="0 -2 28 28" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            </div>
                            </div>
                            <div>
                                <h3 class="font-medium" id="password_h3">Parola</h3>
                                <p class="contents" style="word-break: break-word;" name="password" id="password_${data[i].id}">${data[i].password}</p>
                                <div id="copy" name="copy_${data[i].id}_password" class="contents">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline-block cursor-pointer"
                                    fill="none" viewBox="0 -2 28 28" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                    </div>
                                        </div>
                            `
            if (data[i].url != '' && data[i].url != undefined) {
                raw += `
                                <div><h3 class="font-medium pt-3">URL  <div id="copy" name="copy_${data[i].id}_url" class="contents">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline-block cursor-pointer"
                                    fill="none" viewBox="0 -2 28 28" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                </div></h3> 
                                <a class="contents" href="${data[i].url}" target="_blank" id="url_${data[i].id}" rel="noopener noreferrer nofollow">${data[i].url}</a></div>
                                `}
            raw += `</div></div></div></div></div>`
            list.append(raw)
        }
    } else {
        if (listType === 'search') {
            document.getElementById('not-found').style.display = 'block';
        } else {
            document.getElementById('search-component').style.display = 'none'
            list.append(`
            <div class="m-5 bg-white dark:bg-gray-900">
            <div class="flex p-4 mb-4 text-sm text-blue-700 bg-blue-100 rounded-lg" role="alert">
                <svg aria-hidden="true" class="flex-shrink-0 inline w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clip-rule="evenodd"></path>
                </svg>
                <span class="sr-only">Info</span>
                <div>
                    <span class="font-medium">Kullanmaya başlamadan önce lütfen aşağıdaki bilgileri okuyun</span>
                    <ul class="mt-1.5 ml-4 text-blue-700 list-disc list-inside">
                        <li>Parola Depom, verilerinizi deplomak için tarayıcınızın local storage özelliğini kullanır.</li>
                        <li>Kayıtlar veritabanında tutulmadığı için daha güvenli bir saklama alanıdır.</li>
                        <li>Sitedeki verileri temizlerseniz tüm eklediğiniz veriler silinir.</li>
                        <li>Başka bir tarayıcıda açarsanız verileriniz gözükmez çünkü her tarayıcının cookie sistemi farklıdır.</li>
                        <li>Yedek sistemiyle verilerinizin yedeğini alıp istediğiniz zaman geri yükleyebilirsiniz.</li>
                    </ul>
                </div>
            </div>
        </div>`);
        }
    }
    return true
}