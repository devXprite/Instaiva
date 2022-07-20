 const checkUsername = async (value) => {
  if (/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{2,29}$/gim.test(value)) {
    $("form").addClass("valid").removeClass("invalid");
    $(".submit.btn").prop("disabled", false);
    $(".invalid_username").hide();
    return true;
  } else {
    $("form").addClass("invalid").removeClass("valid");
    $(".submit.btn").prop("disabled", true);
    $(".invalid_username").show();
    return false;
  }
};

/*
const saveImg = async (url, username = "instagram") => {
  $.ajax({
    url: url,
    cache: false,
    xhrFields: {
      responseType: "blob",
    },
    success:  (data)=> {
      saveAs(data, `Instaiva_${username}.png`);
    },
    error: function () {
      alert("Unable to download Image.")
    },
  });
};

const imgLoadErr = () => {
  $(".userimg").hide();
  $(".img-loading-text").html(
    "eg. Unable to preview Image. <br /><br /> Kindly click on download button to open Image in new Tab."
  );
};

const changeCase = (value) => {
  if (value == true) {
    return "Yes";
  } else if (value == false) {
    return "No";
  } else if (/\n/g.test(value)) {
    return value.replace(/\n/g, "<br>");
  } else {
    return value;
  }
};


const getProfileData = async (username) => {
  $.ajax({
    url: `https://instaiva.herokuapp.com/api/profile/${username}`,
    method: "get",
    beforeSend: () => {
      $(".please_wait").show();
      $(".fa-spinner").css("display", "block");
      $(".results").hide();
      $(".fa-search").hide();
      $(".submit.btn").prop("disabled", true);
      $("#username").prop("disabled", true);
    },
    success: (data) => {
      showProfileData(data);
    },
    error: (jqXHR, textStatus, errorThrown) => {
      handleAjaxError(jqXHR, textStatus, errorThrown);
    },
    complete: () => {
      $(".submit.btn").prop("disabled", false);
      $("#username").prop("disabled", false);
      $(".fa-search").show();
      $(".fa-spinner").hide();
      $(".please_wait").hide();
    },
    dataType: "json",
  });
};

const showProfileData = async (data) => {
  console.log(data);
  $("#other_details").html(" ");
  $(".results").show();
  $("#userimg").show().attr("src", data.profile_pic_url);
  $(".img-loading-text").html("Please wait <br /><br /> Image is loading");
  window.location.href = "#userimg";

  $("#posts").text(data.posts);
  $("#following").text(data.following);
  $("#followers").text(data.followers);
  $("#opn-insta").attr("href", `https://www.instagram.com/${data.username}`);
  $(".btn.download").click(() => {
    saveImg(data.profile_pic_url, data.username);
  });

  objKeys = Object.keys(data);
  objKeys.forEach((key) => {
    if (!/(followers|following|profile_pic_url|posts)/gi.test(key)) {
      $("#other_details").append(`
        <p> ${jsConvert.toSentenceCase(key)} : <span> ${changeCase(
        data[key]
      )} </span> </p>
      `);
    }
  });
};

const handleAjaxError = async (jqXHR, textStatus, errorThrown) => {
  switch (jqXHR.status) {
    case 404:
      Swal.fire("Error 404", "User Not Found", "warning");
      break;
    case 429:
      Swal.fire(
        "Error 429",
        "We're sorry, but you have sent too many requests to us recently. Please try again later. That's all we know",
        "warning"
      );
      break;
    case 400:
      Swal.fire("Error 400", "Invalid Username", "warning");
      break;
    case 500:
      Swal.fire(
        "Error 500",
        "Apparentily something went wrong on the server's side. Please try again later. That's all we know.",
        "warning"
      );
      break;
    default:
      Swal.fire(
        "Unexpected Error",
        "Unknown error occurred while processing your request. Please try again.",
        "warning"
      );
  }
};

const typed = new Typed("#username", {
  strings: [
    "eg. cristiano",
    "eg. virat.kohli",
    "eg. leomessi",
    "eg. iamsrk",
    "eg. therock",
    "eg. nike",
    "eg. neymarjr",
    "eg. nasa",
    "eg. priyankachopra",
    "eg. jlo",
    "eg. khaby00",
    "eg. lalalalisa_m",
    "eg. badgalriri",
    "eg. realmadrid",
    "eg. shakira",
  ],
  loop: true,
  typeSpeed: 100,
  backSpeed: 40,
  backDelay: 2000,
  startDelay: 3000,
  showCursor: true,
  attr: "placeholder",
  smartBackspace: true,
  bindInputFocusEvents: true,
});

$("#form").submit((e) => {
  e.preventDefault();
  let username = $("#username").val();
  getProfileData(username);
});

$(".userimg").on("error", imgLoadErr);
 */

console.log("App is OK")