$("#newButton").click(function () {
    $('#newForm').first().fadeToggle(200, 'linear');
    $(this).text(function (i, text) {
        return text === "Kapat" ? "Yeni" : "Kapat";
    })
});

// new record
$("#new").click(function () {
    event.preventDefault();
    const formData = $('#form').serializeArray()
    const platform = formData[0].value;
    const username = formData[1].value;
    const password = formData[2].value;
    const total = { "platform": platform, "name": username, "password": password };
    setCookie(total)
    $('#newForm').toggle();
    $('#newButton').text('Yeni')
    $('input[name=platform]').val('')
    $('input[name=password]').val('')

    listAll()
    handlePreferences()
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
    })
    Toast.fire({
        type: 'success',
        title: 'Başarıyla eklendi'
    })
});

// copy
$(document).ready(function () {
    setTimeout(function () {
        $(document).on('click', '#copy', function () {
            const name = this.attributes.name.value;
            const getId = name.split('_');
            const find = findById(getId[1]);
            navigator.clipboard.writeText(find[getId[2]]).then(function () {
                const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000
                })
                Toast.fire({
                    type: 'success',
                    title: 'Kopyalandı'
                })
            }, function (err) {
                console.error('Async: Could not copy text: ', err);
            });
        });
    }, 100);
});

// delete
$(document).ready(function () {
    setTimeout(function () {
        $(document).on('click', '#delete', function () {
            const name = this.attributes.name.value;
            const getId = name.split('_');
            deleteCookie(getId[1])
        });
    }, 100);
});

// yedek
$("#getBackup").click(function () {
    event.preventDefault();
    Swal.fire({
        title: 'Yedeği İndir',
        text: `İnecek dosyada tüm bilgilerin sansürsüz ve şifresiz şekilde açıkça yazıyor. Lütfen dosyayı başkasına verme.`,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'İndir',
        cancelButtonText: 'Kapat'
    }).then((result) => {
        if (result.value === true) {
            getBackup()
        }
    })
});
handlePreferences = () => {
    const preferences = getCookie('paroladepom_preferences')
    const defaultUsername = preferences.find(data => data.name === 'defaultUsername')
    const hidePasswords = preferences.find(data => data.name === 'hidePasswords')
    if (defaultUsername) {
        $('#defaultUsername').val(defaultUsername.value)
        $('input[name=username]').val(defaultUsername.value)
    }
    if (hidePasswords) {
        $('p[name=password]').text('*gizlendi*')
        $('#hidePasswords').prop('checked', true)
    } else {
        listAll()
    }
}

modalClose = (modal) => {
    const modalToClose = document.querySelector('.' + modal);
    $(modalToClose)
        .first()
        .fadeToggle(100)
        .css("display", "none")
}

openModal = (modal) => {
    const modalToOpen = document.querySelector('.' + modal);
    $(modalToOpen)
        .first()
        .fadeToggle(50)
        .css("display", "flex")
}