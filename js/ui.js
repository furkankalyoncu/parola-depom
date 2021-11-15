$("#newButton").click(function () {
    $('#newForm').toggle();
    $(this).text(function (i, text) {
        return text === "Kapat" ? "Yeni" : "Kapat";
    })
});

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
    $('input').val('')
    listAll()
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
            listAll()
            // const Toast = Swal.mixin({
            //     toast: true,
            //     position: 'top-end',
            //     showConfirmButton: false,
            //     timer: 2000
            // })
            // Toast.fire({
            //     type: 'success',
            //     title: 'Silindi'
            // })
        });
    }, 100);
});