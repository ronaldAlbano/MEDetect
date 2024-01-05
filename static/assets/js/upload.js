document.addEventListener("DOMContentLoaded", function (event) {
  console.log("me here ready >>>");

  const fileUpload = document.querySelector("#upload-form #image");
  const imagePreviewContainer = document.querySelector("#image-preview-container");
  const imagePreview = document.querySelector("#image-preview");
  const imageInputContainer = document.querySelector("#image-input-container");
  const submit = document.querySelector("#upload-next");
  const form = document.querySelector("#upload-form");
  const uploadAgainBtn = document.querySelector("#upload-again-btn");
  const uploadAgainBtn2 = document.querySelector("#upload-again-btn-2");
  const spinner = document.querySelector("#spinner"); 
  const uploadText = document.querySelector("#upload-text");

  function isImage(file) {
    const validImageFormats = ["image/jpeg", "image/jpg", "image/png"];
    return validImageFormats.includes(file.type);
   }

   fileUpload.addEventListener("change", function (event) {
    const file = event.target.files?.[0];
    if (file) {
       if (!isImage(file)) {
         alert("Please select an image file");
         return;
       }
       imagePreview.src = URL.createObjectURL(file);
       imagePreviewContainer.classList.remove("hidden");
       imagePreview.classList.add("cursor-pointer");
       imageInputContainer.classList.add("hidden");
       submit.classList.remove("hidden");
    }
   });

  imagePreview.addEventListener("click", function (event) {
    fileUpload.click();
  });

  

  async function uploadImage(action = '', form) {
    spinner.classList.remove("hidden");
    uploadText.innerHTML = 'Uploading...';
    submit.setAttribute('disabled', 'disabled');
    console.log('upload image function call >>', form);
    const response = await fetch(action, {
      method: 'POST',
      body: new FormData(form),
    }).then(response => response.json()).then((response) => {
      console.log(response);
      if (response.success) {
        document.querySelector("#result-preview").src = response.file_path;
        document.querySelector("#upload-form-one").classList.add('hidden');
        document.querySelector("[data-form-view='upload-form-one']").classList.remove('active');
        document.querySelector("#result-form-one").classList.remove('hidden');
        document.querySelector("[data-form-view='result-form-one']").classList.add('active');


        document.querySelector('#result-options-container-2').classList.add('hidden');
        document.querySelector('#result-options-container').classList.remove('hidden');
        document.querySelector('#result-options-container').classList.remove('hidden');

        spinner.classList.add("hidden");
        uploadText.innerHTML = 'Upload';
        submit.removeAttribute('disabled');
      } else {
        document.querySelector("#result-preview").src = response.file_path;
        document.querySelector("#upload-form-one").classList.add('hidden');
        document.querySelector("[data-form-view='upload-form-one']").classList.remove('active');
        document.querySelector("#result-form-one").classList.remove('hidden');
        document.querySelector("[data-form-view='result-form-one']").classList.add('active');
        
          // Hide the current container
        document.querySelector('#result-options-container').classList.add('hidden');
        document.querySelector('#result-options-container-2').classList.remove('hidden');
        document.querySelector('#result-options-container-2').classList.remove('hidden');
        document.querySelector('#result-options-container-2').classList.remove('hidden');

  

        spinner.classList.add("hidden");
        uploadText.innerHTML = 'Upload';
        submit.removeAttribute('disabled');
      }
    });
    return response;
  }
  

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    console.log('me submitted >>');
    action = this.getAttribute('action');
    uploadImage(action, form);
    
  });

  // submit.addEventListener("click", function (event) {
  //   event.preventDefault();
  //   action = form.getAttribute('action');
  //   uploadImage(action, form);
  // });

  uploadAgainBtn.addEventListener('click', function () {
    
    document.querySelector("#upload-form-one").classList.remove('hidden');
    document.querySelector("[data-form-view='upload-form-one']").classList.add('active');
    document.querySelector("#result-form-one").classList.add('hidden');
    document.querySelector("[data-form-view='result-form-one']").classList.remove('active');

    imagePreviewContainer.classList.add("hidden");
    imagePreview.classList.remove("cursor-pointer");
    imageInputContainer.classList.remove("hidden");
    submit.classList.add("hidden");
  })

  uploadAgainBtn2.addEventListener('click', function () {
    
    document.querySelector("#upload-form-one").classList.remove('hidden');
    document.querySelector("[data-form-view='upload-form-one']").classList.add('active');
    document.querySelector("#result-form-one").classList.add('hidden');
    document.querySelector("[data-form-view='result-form-one']").classList.remove('active');

    imagePreviewContainer.classList.add("hidden");
    imagePreview.classList.remove("cursor-pointer");
    imageInputContainer.classList.remove("hidden");
    submit.classList.add("hidden");
  })

  const resultPreviewContainer = document.querySelector("#result-preview-container");
  const fullImagePopup = document.createElement("div");
  fullImagePopup.classList.add(
    "fixed",
    "top-0",
    "left-0",
    "w-full",
    "h-full",
    "flex",
    "justify-center",
    "items-center",
    "bg-black",
    "bg-opacity-80",
    "z-50",
    "hidden"
  );
  const fullImage = document.createElement("img");
  fullImage.classList.add("max-w-[90%]", "max-h-[90%]", "rounded-lg");
  fullImagePopup.appendChild(fullImage);
  document.body.appendChild(fullImagePopup);

  resultPreviewContainer.addEventListener("click", function (event) {
    const imageUrl = document.querySelector("#result-preview").src;
    fullImage.src = imageUrl;
    fullImagePopup.classList.remove("hidden");
  });

  fullImagePopup.addEventListener("click", function (event) {
    if (event.target === fullImagePopup) {
      fullImagePopup.classList.add("hidden");
    }
  });

});




