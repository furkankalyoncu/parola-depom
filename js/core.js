getCookie = (name = "paroladepom") => {
  const getLocalStorage = localStorage.getItem(name);
  let data = [];
  getLocalStorage !== "" ? (data = JSON.parse(getLocalStorage)) : false;
  return data || [];
};

findPlatform = (platform) => {
  const data = getCookie();
  return data.find((d) => d.platform == platform) || false;
};

findById = (id) => {
  const data = getCookie();
  return data.find((d) => d.id == id) || false;
};

getRandomId = () => {
  return Math.random().toString(36).substr(2, 6);
};

setCookie = (value, name = "paroladepom") => {
  let id = getRandomId();
  var currentCookies = getCookie();
  let newValue = {
    id: id,
    platform: value.platform,
    name: value.name,
    password: value.password,
  };
  typeof value.url != undefined ? (newValue.url = value.url) : {};
  currentCookies.push(newValue);
  localStorage.setItem(name, JSON.stringify(currentCookies));
  // Cookies.set(name, currentCookies, { expires: 3500, secure: true });
};

deleteCookie = (id, name = "paroladepom") => {
  let currentCookies = getCookie();
  let record = currentCookies.find((d) => d.id == id) || false;
  if (record) {
    Swal.fire({
      title: "Emin misin?",
      text: `${record.platform} kaydı emrinle silinecek. Cümle alem toplansa geri getiremez bir daha.`,
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Evet",
      cancelButtonText: "Hayır",
    }).then((result) => {
      if (result.value === true) {
        currentCookies.splice(
          currentCookies.findIndex(function (i) {
            return i.id == id;
          }),
          1
        );
        localStorage.setItem(name, JSON.stringify(currentCookies));
        listSidebar();
        handlePreferences();
        hideCard();
        Swal.fire("Silindi", "Patron sensin.", "success");
      }
    });
  } else {
    Swal.fire("Hata", "Bir hata oluştu. Tıkladığın kaydı bulamıyorum.", "error");
  }
};

editCookie = (id, data) => {
  let currentCookies = getCookie();
  let objIndex = currentCookies.findIndex((d) => d.id == id);
  currentCookies[objIndex].platform = data.platform;
  currentCookies[objIndex].name = data.name;
  currentCookies[objIndex].password = data.password;
  typeof currentCookies[objIndex].url != undefined
    ? (currentCookies[objIndex].url = data.url)
    : {};
  localStorage.setItem("paroladepom", JSON.stringify(currentCookies));
};

savePreferences = (form, name = "paroladepom_preferences") => {
  const formData = $(form).serializeArray();
  localStorage.setItem(name, JSON.stringify(formData));
  $("#selected-card").addClass("hidden");
  modalClose("main-modal");
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
  });
  Toast.fire({
    type: "success",
    title: "Kaydedildi",
  });
  listSidebar();
  handlePreferences();
};

now = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  var hh = String(today.getHours()).padStart(2, "0");
  var min = String(today.getMinutes()).padStart(2, "0");
  return dd + "-" + mm + "-" + yyyy + " " + hh + "." + min;
};

getBackup = () => {
  const data = JSON.stringify(getCookie());
  var blob = new Blob([data], { type: "text/plain;charset=utf-8" });
  saveAs(blob, `Parola Depom Yedek ${now()}.txt`);
  return true;
};

uploadBackup = () => {
  const [file] = document.querySelector("input[type=file]").files;
  const reader = new FileReader();

  reader.addEventListener(
    "load",
    () => {
      localStorage.setItem("paroladepom", reader.result);
      listSidebar();
      handlePreferences();
      $("#uploadBackupInput").val("İşlem tamam");
      $("#uploadBackupInput").css("background-color", "#059905");
    },
    false
  );

  if (file) {
    reader.readAsText(file);
  }
};

$("#default-search").on("keyup", function (e) {
  const data = getCookie();
  const filteredData = data.filter((d) => {
    const platforms = d.platform
      .toLowerCase()
      .includes(e.target.value.toLowerCase());
    const usernames = d.name
      .toLowerCase()
      .includes(e.target.value.toLowerCase());
    return [platforms, usernames].some((d) => d);
  });
  listSidebar(filteredData, "search");
  handlePreferences();
});

selectData = (id) => {
  $(`#${id}`).click();
};

function listSidebar(data = getCookie()) {
  const sidebar = $("#sidebar-content");
  sidebar.html("");
  if (data.length > 0) {
    for (let i = 0; i < data.length; i++) {
      raw = `
      <li class="p-[3px]">
     <input
        type="radio"
        id="${data[i].id}"
        name="sidebar-select"
        value="${data[i].id}"
        class="hidden peer"
        required
        />
     <label
        for="${data[i].id}"
        class="inline-flex justify-between items-center p-3 w-full text-gray-600 bg-white rounded-lg border border-gray-200 cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
        <div class="block">
           <div class="w-full text-md font-semibold">${data[i].platform}</div>
           <div class="w-full">${data[i].name}</div>
        </div>
        <svg
           aria-hidden="true"
           class="ml-3 w- h-5"
           fill="currentColor"
           viewBox="0 0 20 20"
           xmlns="http://www.w3.org/2000/svg"
           >
           <path
              fill-rule="evenodd"
              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
              clip-rule="evenodd"
              ></path>
        </svg>
     </label>
  </li>
      `;
      sidebar.append(raw);
    }
  } else {
    sidebar.html(`<div class="no-data">Kayıt bulunamadı.</div>`);
  }
}

function landing() {
  const landing = document.getElementById("landing");
  const sidebar = document.getElementById("list-sidebar");
  const data = getCookie();
  if (data.length === 0) {
    // remove hidden class
    landing.classList.remove("hidden");
    sidebar.classList.add("hidden");
  }
}
