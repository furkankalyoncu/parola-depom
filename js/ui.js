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
    $("a[id=selected-password]").text("••••••••••");
    $("#hidePasswords").prop("checked", true);
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
  const data = findById(event.target.id);
  $("#selected-card").removeClass("hidden");
  $("#selected-card").fadeIn(100);
  $("#selected-title").html(data.platform);
  $("#selected-username").html(data.name);
  $("#selected-password").html(data.password);
  $("#selected-password").attr("name", data.id);
  $("#edit").attr("name", data.id);
  $("#delete").attr("name", data.id);
  if (data.url) {
    $("#selected-url-section").removeClass("hidden");
    $("#selected-url").html(data.url);
    $("#selected-url").attr("href", data.url);
    $("#selected-url").attr("target", "_blank");
    $("#selected-url").attr("rel", "noopener noreferrer nofollow");
  } else {
    $("#selected-url-section").addClass("hidden");
  }
  handlePreferences();
});

function copy(t) {
  const element = $(t).parent().parent().find("a");
  const elementName = element[0].name;
  let value = element.text();
  if (+elementName) {
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

hideCard = () => {
  $("#selected-card").fadeOut(100);
  $("#selected-card").addClass("hidden");
};
