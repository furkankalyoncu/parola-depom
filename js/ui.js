$("#newButton").click(function () {
  $("#newForm").first().fadeToggle(100, "linear");
  $(this).text(function (i, text) {
    return text === "Kapat" ? "Yeni Ekle" : "Kapat";
  });
});

// new record
$("#new").click(function (event) {
  event.preventDefault();
  const formData = $("#form").serializeArray();
  const platform = formData.find((d) => d.name === "platform");
  const username = formData.find((d) => d.name === "username");
  const password = formData.find((d) => d.name === "password");
  const url = formData.find((d) => d.name === "url");
  const newTotal = {
    platform: platform.value,
    name: username.value,
    password: password.value,
    url: url.value,
  };
  setCookie(newTotal);
  $("#newForm").toggle();
  $("#newButton").text("Yeni Ekle");
  $("input[name=platform]").val("");
  $("input[name=password]").val("");
  $("input[name=url]").val("");
  listSidebar();
  handlePreferences();
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
  });
  Toast.fire({
    type: "success",
    title: "Başarıyla eklendi",
  });
});

// delete button
$(document).on("click", "#delete", function () {
  const name = this.attributes.name.value;
  deleteCookie(name);
});

// edit button
$(document).on("click", "#edit", function (event) {
  event.preventDefault();
  const name = this.attributes.name.value;
  const record = findById(name);
  $("#editTitle").html(record.platform);
  $("#editPlatform").val(record.platform);
  $("#editURL").val(record.url);
  $("#editUsername").val(record.name);
  $("#editPassword").val(record.password);
  $("#editId").val(record.id);
  $("html, body").animate({ scrollTop: 0 }, "fast");
  $("#editForm").fadeIn(200, "linear");
});

// edit record
$(document).on("click", "#editSave", function (event) {
  event.preventDefault();
  const formData = $("#editFormForm").serializeArray();
  const getId = $("#editId").val();
  const platform = formData.find((d) => d.name === "editPlatform");
  const username = formData.find((d) => d.name === "editUsername");
  const password = formData.find((d) => d.name === "editPassword");
  const url = formData.find((d) => d.name === "editURL");
  const total = {
    id: getId,
    platform: platform.value,
    name: username.value,
    password: password.value,
  };
  url.value != "" ? (total.url = url.value) : "";
  editCookie(getId, total);
  listSidebar();
  handlePreferences();
  selectData(getId);
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
  });
  Toast.fire({
    type: "success",
    title: "Başarıyla güncellendi",
  });
  $("#editForm").slideUp(200);
  setTimeout(function () {
    $("#editTitle").html("Düzenle");
    $("#editPlatform").val("");
    $("#editURL").val("");
    $("#editUsername").val("");
    $("#editPassword").val("");
    $("#editId").val("");
  }, 200);
});

// handle cancel and close button in edit form
$(document).on("click", "#closeEdit, #editCancel", function () {
  Swal.fire({
    title: "Emin misin?",
    text: `Düzenleme iptal edilecek ve bu geri alınamaz.`,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Evet",
    cancelButtonText: "Hayır",
  }).then((result) => {
    if (result.value === true) {
      event.preventDefault();
      $("#editForm").slideUp(200);
      setTimeout(function () {
        $("#editTitle").html("");
        $("#editPlatform").val("");
        $("#editURL").val("");
        $("#editUsername").val("");
        $("#editPassword").val("");
      }, 200);
    }
  });
});

$("#getBackup").click(function (event) {
  event.preventDefault();
  Swal.fire({
    title: "Yedeği İndir",
    text: `İnecek dosyada tüm bilgilerin sansürsüz ve şifresiz şekilde açıkça yazıyor. Lütfen dosyayı başkasına verme.`,
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "İndir",
    cancelButtonText: "Kapat",
  }).then((result) => {
    if (result.value === true) {
      getBackup();
    }
  });
});

handlePreferences = () => {
  if (!localStorage.getItem("paroladepom_preferences")) {
    localStorage.setItem(
      "paroladepom_preferences",
      '[{"name":"defaultUsername","value":""},{"name":"sortBy","value":"newer"}, {"name":"hidePasswords","value":""}]'
    );
  }

  const preferences = JSON.parse(
    localStorage.getItem("paroladepom_preferences")
  );
  const defaultUsername = preferences.find(
    (data) => data.name === "defaultUsername"
  );
  const hidePasswords = preferences.find(
    (data) => data.name === "hidePasswords"
  );
  const sortBy = preferences.find((data) => data.name === "sortBy");

  if (sortBy) {
    if (sortBy.value == "older") {
      $("#sidebar-content").removeClass("flex-col-reverse");
      $("#sidebar-content").addClass("flex-col");
      $("#list").css("flex-flow", "wrap-reverse");
      $("#list").css("flex-direction", "row-reverse");
      $("#sortBy").val("older");
    } else if (sortBy.value == "newer") {
      $("#sidebar-content").removeClass("flex-col");
      $("#sidebar-content").addClass("flex-col-reverse");
      $("#sortBy").val("newer");
    }
  }

  if (defaultUsername) {
    $("#defaultUsername").val(defaultUsername.value);
    $("input[name=username]").val(defaultUsername.value);
  }

  if (hidePasswords) {
    $("a[id=selected-password]").text("•••••••");
    $("#hidePasswords").prop("checked", true);
    $("a[id=selected-password]").attr("data-hide", "true");
  } else {
    $("a[id=selected-password]").attr("data-hide", "false");
  }
};

modalClose = (modal) => {
  const modalToClose = document.querySelector("." + modal);
  $(modalToClose).attr("name", "closed");
  $(modalToClose).first().fadeToggle(100).css("display", "none");
};

openModal = (modal) => {
  const modalToOpen = document.querySelector("." + modal);
  $(modalToOpen).attr("name", "opened");
  $(modalToOpen).first().fadeToggle(50).css("display", "flex");
};

hideCard = () => {
  $("#selected-card").fadeOut(100);
  $("#selected-card").addClass("hidden");
};

function copy(t) {
  const element = $(t).parent().parent().find("a");
  const elementName = element[0].name;
  const elementId = element[0].id;
  let value = element.text();
  if (elementId === "selected-password") {
    value = findById(elementName).password;
  }
  navigator.clipboard.writeText(value).then(
    function () {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
      });
      Toast.fire({
        type: "success",
        title: "Kopyalandı",
      });
    },
    function (err) {
      Toast.fire({
        type: "error",
        title: "Kopyalanamadı!",
      });
      console.error("Async: Could not copy text: ", err);
    }
  );
}

$("html")[0].addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    if ($("#modal").attr("name") === "opened") {
      savePreferences(document.getElementById("preferencesForm"));
      $("body").focus();
    }
  }
});

$(document).on("click", "#navbar-mobile", function (event) {
  event.preventDefault();
  $("#navbar-default").toggle();
});

$(document).on("click", "input[name=sidebar-select]", function (event) {
  saveClick(event.target.id);
  const data = findById(event.target.id);
  if (!data) {
    $("input:radio[name=sidebar-select]").prop("checked", false);
    hideCard();
  } else {
    const { platform, name, password, url, id } = data;

    $("#username-label").html(formatEmailText(name));

    $("#url-label").html(formatURLText(url));

    $("#selected-card").removeClass("hidden");
    $("#selected-card").fadeIn(100);
    $("#selected-title").html(platform);
    $("#selected-username").html(name);
    $("#selected-password").html(password);
    $("#selected-password").attr("name", id);
    $("#share-button").attr("name", id);
    $("#edit").attr("name", id);
    $("#delete").attr("name", id);

    if (url) {
      $("#selected-url-section").removeClass("hidden");
      $("#selected-url").html(url);
      $("#selected-url").attr("href", url);
      $("#selected-url").attr("target", "_blank");
      $("#selected-url").attr("rel", "noopener noreferrer nofollow");
    } else {
      $("#selected-url-section").addClass("hidden");
    }
  }
  handlePreferences();
});

$(document).on("click", "#share-button", function (event) {
  event.preventDefault();
  const data = findById(event.target.name);
  const { name, password, url, id } = data;
  const dummy = document.createElement("textarea");
  document.body.appendChild(dummy);

  dummy.setAttribute("id", "dummy_id");
  dummy.setAttribute("contenteditable", "");
  dummy.innerHTML = `${
    url != "" && url != undefined ? `${formatURLText(url)}: ${url}\n` : ""
  }${name != "" ? `${formatEmailText(name)}: ${name}\n` : ""}${
    password != "" ? `Parola: ${password}` : ""
  }`;

  navigator.clipboard.writeText(dummy.innerHTML).then(
    function () {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
      });
      Toast.fire({
        type: "success",
        title: "Tüm bilgiler kopyalandı!",
      });
    },
    function (err) {
      Toast.fire({
        type: "error",
        title: "Kopyalanamadı!",
      });
      console.error("Async: Could not copy text: ", err);
    }
  );

  document.body.removeChild(dummy);
});

$(document).on("click", "#show-selected-password", function (event) {
  event.preventDefault();
  const password = document.getElementById("selected-password");
  const hideAttr = password.getAttribute("data-hide");

  if (hideAttr === "true") {
    $("a[id=selected-password]").attr("data-hide", "false");
    password.innerHTML = findById(password.name).password;
  } else {
    $("a[id=selected-password]").attr("data-hide", "true");
    password.innerHTML = "•••••••";
  }
});

function formatEmailText(data) {
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return emailRegex.test(data) ? "E-posta" : "Kullanıcı adı";
}

function formatURLText(data) {
  const ipRegex = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/;
  return ipRegex.test(data) ? "IP Adresi" : "URL";
}
