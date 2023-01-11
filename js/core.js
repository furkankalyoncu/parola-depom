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
        const lastClicks = localStorage
          .getItem("paroladepom_lastClicks")
          .split(" ");
        console.log("lastClicks", lastClicks);
        console.log("lastClicks includes", lastClicks.includes(id));
        if (lastClicks.includes(id)) {
          const newClicks = lastClicks.filter((x) => x != id);
          localStorage.setItem("paroladepom_lastClicks", newClicks.join(" "));
        }

        listSidebar();
        handlePreferences();
        hideCard();
        Swal.fire("Silindi", "Patron sensin.", "success");
      }
    });
  } else {
    Swal.fire(
      "Hata",
      "Bir hata oluştu. Tıkladığın kaydı bulamıyorum.",
      "error"
    );
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
  if (e.target.value != "") {
    listSidebar("search", filteredData);
  } else {
    listSidebar();
  }
  handlePreferences();
});

selectData = (id) => {
  $(`#${id}`).click();
};

function listSidebar(type = "default", data = getCookie()) {
  const sidebar = $("#sidebar-content");
  const topList = mostClicksData().topList?.reverse() || [];
  landing();
  sidebar.html("");

  let filteredData = [];
  if (type == "search") {
    filteredData = data;
  } else {
    filteredData = data.filter((d) => {
      const ids = topList.find((t) => t.id == d.id);
      return !ids;
    });
  }

  if (filteredData.length > 0 || topList.length > 0) {
    for (let i = 0; i < filteredData.length; i++) {
      raw = `
      <li class="p-[3px]">
     <input
        type="radio"
        id="${filteredData[i].id}"
        name="sidebar-select"
        value="${filteredData[i].id}"
        class="hidden peer"
        required
        />
     <label
        for="${filteredData[i].id}"
        class="inline-flex justify-between items-center p-3 w-full text-gray-600 bg-white rounded-lg border border-gray-200 cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
        <div class="block">
           <div class="w-full text-md font-semibold">${filteredData[i].platform}</div>
           <div class="w-full">${filteredData[i].name}</div>
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

    if (topList.length > 0 && type == "default") {
      setTimeout(() => {
        let topListHeader = `
    <a class="block mt-2 pl-1 max-w-sm">
    <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">Sık Kullanılanlar</h5>
      `;
        sidebar.append(topListHeader);
      }, 1);
      sidebar.append(
        `<hr class="my-4 h-px bg-gray-200 border-0 dark:bg-gray-700"> `
      );

      for (let k = 0; k < topList.length; k++) {
        const getFullData = findById(topList[k].id);
        mostClick = `   
    <li class="p-[3px]">
      <input
          type="radio"
          id="${topList[k].id}"
          name="sidebar-select"
          value="${topList[k].id}"
          class="hidden peer"
          required
          />
      <label
          for="${topList[k].id}"
          class="inline-flex justify-between items-center p-3 w-full text-gray-600 bg-white rounded-lg border border-gray-200 cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
          <div class="block">
            <div class="w-full text-md font-semibold">${getFullData.platform}</div>
            <div class="w-full">${getFullData.name}</div>
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
        sidebar.append(mostClick);
      }
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
    landing.classList.remove("hidden");
    sidebar.classList.add("hidden");
  } else {
    landing.classList.add("hidden");
    sidebar.classList.remove("hidden");
  }
}

function saveClick(id) {
  const data = getCookie();
  if (!localStorage.getItem("paroladepom_lastClicks")) {
    localStorage.setItem("paroladepom_lastClicks", "");
  }

  const clicks = localStorage.getItem("paroladepom_lastClicks");
  const checkData = data.filter((d) => d.id == id);

  if (checkData.length > 0) {
    var updatedClicks = `${id} ${clicks}`;
    localStorage.setItem("paroladepom_lastClicks", updatedClicks);
  }
}

function mostClicksData() {
  const data = getCookie();
  const clicks = localStorage.getItem("paroladepom_lastClicks");
  if (clicks) {
    const clicksArray = clicks.split(" ").filter((x) => x != "");

    const counts = {};
    clicksArray.forEach(function (x) {
      counts[x] = (counts[x] || 0) + 1;
    });

    const mostClickedId = Object.keys(counts).reduce(function (a, b) {
      return counts[a] > counts[b] ? a : b;
    });

    const mostClickedData = data.find((d) => d.id == mostClickedId);

    const topList =
      Object.keys(counts)
        .filter((x) => counts[x] >= 3)
        .sort((a, b) => counts[b] - counts[a])
        .slice(0, 3)
        .map((key) => ({ id: key, count: counts[key] })) || [];

    return {
      counts,
      mostClickedId,
      mostClickedData,
      topList,
    };
  }
  return 0;
}

console.log(mostClicksData());
