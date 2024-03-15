(() => {
  const fileInput = document.getElementById("file-input");
  const dropArea = document.getElementById("drop-area");
  const qnaSection = document.getElementById("FAQ-section");
  const downloadBtn = document.getElementById("Dw-btn");
  const language = document.getElementById("earth-icon");
  const languageModal = document.getElementById("language-modal");
  const languageModalClose = document.querySelector(
    "#language-select-container>img"
  );
  const mail = document.getElementById("email-icon");
  const mailModal = document.getElementById("mail-modal");
  const mailModalCloseBtn = document.querySelector("#mail-container > img");
  const mailForm = document.getElementById("mail-form");

  const header = document.querySelector("header");

  let fileList = [];

  const visibleLoading = (isVisible) => {
    const loading = document.getElementById("upload-loading-circle-container");
    if (isVisible) {
      loading.classList.remove("hidden");
    } else {
      loading.classList.add("hidden");
    }
  };

  const visibleUpload = (isVisible) => {
    const upload = document.getElementById("upload");
    if (isVisible) {
      upload.classList.remove("hidden");
    } else {
      upload.classList.add("hidden");
    }
  };

  const visibleImgPreview = (isVisible) => {
    const preview = document.getElementById("image-preview");
    if (isVisible) {
      preview.classList.remove("hidden");
    } else {
      preview.classList.add("hidden");
    }
  };

  const visibleDownloadPart = (isVisible) => {
    const downloadPart = document.getElementById("download-part");
    if (isVisible) {
      downloadPart.classList.remove("hidden");
    } else {
      downloadPart.classList.add("hidden");
    }
  };

  const imagePreview = (imgList) => {
    const preview = document.getElementById("image-preview");
    const listLength = imgList.length;
    preview.innerHTML = "";
    Array.from(imgList).forEach((img, index) => {
      const fileReader = new FileReader();
      const filename = img.name;
      const previewContainer = document.createElement("div");
      const deleteBtn = document.createElement("button");
      previewContainer.classList.add("preview-image-container");
      deleteBtn.classList.add("delete-btn");
      deleteBtn.onclick = (e) => {
        const filename = e.target.nextSibling.getAttribute("data-name");
        e.target.parentElement.remove();
        fileList = fileList.filter((file) => file.filename !== filename);
        const totalImage = document.querySelector("#total-image>span");
        const imageCount = fileList.length;
        totalImage.innerText = `${imageCount}`;
        if (imageCount === 0) {
          visibleUpload(true);
          visibleImgPreview(false);
          visibleDownloadPart(false);
        }
      };
      previewContainer.appendChild(deleteBtn);
      preview.appendChild(previewContainer);
      fileReader.readAsDataURL(img);
      fileReader.onload = () => {
        const imgObj = new Image();
        imgObj.classList.add("preview-image");
        imgObj.src = fileReader.result;
        imgObj.setAttribute("data-name", `(${index})${filename}`);
        fileList.push({
          base64: fileReader.result,
          filename: filename,
        });
        imgObj.onload = () => {
          previewContainer.appendChild(imgObj);
          if (index + 1 === listLength) {
            const totalImage = document.querySelector("#total-image>span");
            visibleLoading(false);
            visibleImgPreview(true);
            visibleDownloadPart(true);
            totalImage.innerText = index + 1;
          }
        };
      };
    });
  };

  const fileReceiver = (e) => {
    const files = e.target.files ?? e.dataTransfer.files;
    visibleLoading(true);
    visibleUpload(false);
    imagePreview(files);
  };

  const fileDownLoad = () => {
    visibleLoading(true);
    const drawCanvas = document.createElement("canvas");
    const context = drawCanvas.getContext("2d");
    const isZip = document.getElementById("zip").checked;
    const zip = new JSZip();

    fileList.forEach(({ base64, filename }, index, ary) => {
      const imgObj = new Image();
      imgObj.src = base64;
      imgObj.onload = (e) => {
        drawCanvas.width = e.target.width;
        drawCanvas.height = e.target.height;
        context.drawImage(e.target, 0, 0);
        const newBase64 = drawCanvas.toDataURL("image/jpeg", 0.8);
        if (isZip) {
          const base64part = newBase64.split(",")[1];
          zip.file(filename, base64part, { base64: true });
          if (index + 1 == ary.length) {
            zip.generateAsync({ type: "blob" }).then(function (content) {
              saveAs(content, "reduced.zip");
              visibleLoading(false);
              visibleUpload(true);
            });
          }
        } else {
          const downloadAtag = document.createElement("a");
          downloadAtag.download = filename;
          downloadAtag.href = newBase64;
          downloadAtag.click();
          visibleLoading(false);
          visibleUpload(true);
        }
      };
    });
    visibleImgPreview(false);
    visibleDownloadPart(false);
    document.getElementById("file-input").value = "";
    fileList = [];
  };

  qnaSection.addEventListener("click", (e) => {
    if (e.target.className === "arrow-btn") {
      const grandParent = e.target.parentElement.parentElement;
      const answer = grandParent.lastElementChild;
      if (answer.classList.contains("active")) {
        answer.classList.remove("active");
        answer.style.maxHeight = null;
        e.target.style.transform = "rotate(-90deg)";
      } else {
        answer.classList.add("active");
        answer.style.maxHeight = `${answer.scrollHeight}px`;
        e.target.style.transform = "rotate(90deg)";
      }
    }
  });

  fileInput.addEventListener("input", fileReceiver);
  downloadBtn.addEventListener("click", fileDownLoad);

  // 드래그앤드롭기능 구현
  dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.target.classList.remove("visible-hidden");
  });
  dropArea.addEventListener("dragleave", (e) => {
    e.preventDefault();
    e.target.classList.add("visible-hidden");
  });
  dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    fileReceiver(e);
    e.target.classList.add("visible-hidden");
  });

  // 언어변경 기능 구현
  language.addEventListener("click", () => {
    languageModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  });
  languageModal.addEventListener("click", (e) => {
    if (e.target.id === "language-modal") {
      e.target.classList.add("hidden");
      document.body.style.overflow = "auto";
    }
  });
  languageModalClose.addEventListener("click", () => {
    languageModal.classList.add("hidden");
    document.body.style.overflow = "auto";
  });

  // 메일보내기 기능 구현
  mail.addEventListener("click", () => {
    mailModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  });
  mailModal.addEventListener("click", (e) => {
    if (e.target.id === "mail-modal") {
      e.target.classList.add("hidden");
      document.body.style.overflow = "auto";
    }
  });
  mailModalCloseBtn.addEventListener("click", () => {
    mailModal.classList.add("hidden");
    document.body.style.overflow = "auto";
  });
  mailForm.addEventListener("submit", (e) => {
    alert("Your opinion have been sended!");
    document.querySelector("#mail-title").value = "";
    document.querySelector("#mail-content").value = "";
    mailModal.classList.add("hidden");
    document.body.style.overflow = "auto";
  });

  window.addEventListener("load", () => {
    document.getElementById("all-loading").classList.add("hidden");
    document.body.style.overflow = "auto";
  });
})();
