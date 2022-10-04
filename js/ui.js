$("#newButton").click(function () {
    $('#newForm').first().fadeToggle(200, 'linear');
    $(this).text(function (i, text) {
        return text === "Kapat" ? "Yeni Ekle" : "Kapat";
    })
});

// new record
$("#new").click(function () {
    event.preventDefault();
    const formData = $('#form').serializeArray()
    const platform = formData.find(d => d.name === 'platform')
    const username = formData.find(d => d.name === 'username')
    const password = formData.find(d => d.name === 'password')
    const url = formData.find(d => d.name === 'url')
    const newTotal = { "platform": platform.value, "name": username.value, "password": password.value, "url": url.value };
    setCookie(newTotal)
    $('#newForm').toggle();
    $('#newButton').text('Yeni Ekle')
    $('input[name=platform]').val('')
    $('input[name=password]').val('')
    $('input[name=url]').val('')
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
            const splitThis = name.split('_');
            const find = findById(splitThis[1]);
            $('h3').css({ 'color': 'black' })
            $('[id=username_h3]').text('Kullanıcı')
            $('[id=password_h3]').text('Parola')

            if (splitThis[2] === 'password') {
                const passwordP = $('#password_' + splitThis[1]).closest('p')
                const passwordH3 = $(passwordP).prev('h3')
                $(passwordH3).text($(passwordH3).text() + ' (son kopyalanan)')
                $(passwordH3).css('color', 'green')
            } else if (splitThis[2] === 'name') {
                const usernameP = $('#username_' + splitThis[1]).closest('p')
                const usernameH3 = $(usernameP).prev('h3')
                $(usernameH3).text($(usernameH3).text() + ' (son kopyalanan)')
                $(usernameH3).css('color', 'green')
            } else if (splitThis[2] === 'url') {
                const urlP = $('#url_' + splitThis[1]).prev()
                const urlH3 = $(urlP).closest('h3')
                $(urlH3).css('color', 'green')
                $(urlH3).css('color', 'green')
            }

            navigator.clipboard.writeText(find[splitThis[2]]).then(function () {
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
                Toast.fire({
                    type: 'error',
                    title: 'Kopyalanamadı!'
                })
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

// edit record
$(document).ready(function () {
    setTimeout(function () {
        $(document).on('click', '#edit', function () {
            const name = this.attributes.name.value;
            const getId = name.split('_');
            //$('#editForm').show()
            const record = findById(getId[1])
            $('#editTitle').html(record.platform)
            $('#editPlatform').val(record.platform)
            $('#editURL').val(record.url)
            $('#editUsername').val(record.name)
            $('#editPassword').val(record.password)
            $('#editId').val(record.id)
            $('html, body').animate({ scrollTop: 0 }, 'fast');
            $('#editForm').fadeIn(200, 'linear');
        });
    }, 100);
});

// edit record
$(document).ready(function () {
    $(document).on('click', '#editSave', function () {
        event.preventDefault()
        const formData = $('#editFormForm').serializeArray()
        const getId = $('#editId').val()
        const platform = formData.find(d => d.name === 'editPlatform')
        const username = formData.find(d => d.name === 'editUsername')
        const password = formData.find(d => d.name === 'editPassword')
        const url = formData.find(d => d.name === 'editURL')
        const total = { "id": getId, "platform": platform.value, "name": username.value, "password": password.value };
        url.value != '' ? total.url = url.value : '';
        editCookie(getId, total)
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
            title: 'Başarıyla güncellendi'
        })
        $('#editForm').slideUp(200);
        setTimeout(function () {
            $('#editTitle').html('Düzenle')
            $('#editPlatform').val('')
            $('#editURL').val('')
            $('#editUsername').val('')
            $('#editPassword').val('')
            $('#editId').val('')
        }, 200);
    });
});

// handle cancel and close button in edit form
$(document).on('click', '#closeEdit, #editCancel', function () {
    Swal.fire({
        title: 'Emin misin?',
        text: `Düzenleme iptal edilecek ve bu geri alınamaz.`,
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Evet',
        cancelButtonText: 'Hayır'
    }).then((result) => {
        if (result.value === true) {
            event.preventDefault()
            $('#editForm').slideUp(200);
            setTimeout(function () {
                $('#editTitle').html('')
                $('#editPlatform').val('')
                $('#editURL').val('')
                $('#editUsername').val('')
                $('#editPassword').val('')
            }, 200);
        }
    })
});

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
    if (Cookies.get('paroladepom_preferences') === undefined) {
        Cookies.set('paroladepom_preferences', '[{"name":"defaultUsername","value":""},{"name":"sortBy","value":"older"}]')
    }
    const preferences = JSON.parse(Cookies.get('paroladepom_preferences'))
    const defaultUsername = preferences.find(data => data.name === 'defaultUsername')
    const hidePasswords = preferences.find(data => data.name === 'hidePasswords')
    const sortBy = preferences.find(data => data.name === 'sortBy')

    if (sortBy) {
        if (sortBy.value == 'newer') {
            $('#list').css('display', 'flex')
            $('#list').css('flex-flow', 'wrap-reverse')
            $('#list').css('flex-direction', 'row-reverse')
            $("#sortBy").val('newer')
        } else {
            $("#sortBy").val('older')
            listAll()
        }
    }
    if (defaultUsername) {
        $('#defaultUsername').val(defaultUsername.value)
        $('input[name=username]').val(defaultUsername.value)
    }

    if (hidePasswords) {
        $('p[name=password]').text('********')
        $('#hidePasswords').prop('checked', true)
    }
}

modalClose = (modal) => {
    const modalToClose = document.querySelector('.' + modal);
    $(modalToClose).attr('name', 'closed')
    $(modalToClose)
        .first()
        .fadeToggle(100)
        .css("display", "none")
}

openModal = (modal) => {
    const modalToOpen = document.querySelector('.' + modal);
    $(modalToOpen).attr('name', 'opened')
    $(modalToOpen)
        .first()
        .fadeToggle(50)
        .css("display", "flex")
}

// handling the enter key
$('html')[0].addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        if ($('#modal').attr('name') === 'opened') {
            savePreferences(document.getElementById('preferencesForm'))
            $('body').focus()
        }
    }
});