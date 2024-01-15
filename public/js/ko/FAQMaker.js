import { faq } from "./data.js";

const FAQMaker = () => {
  const FAQSection = document.getElementById("FAQ-section");
  faq.forEach(({ q, a }) => {
    FAQSection.innerHTML += `
        <div class="qna">
        <div class="question">
          <p>${q}</p>
          <img src="./public/icon/arrow.svg" alt="펼치기 아이콘" class="arrow-btn" />
        </div>
        <div class="answer">
          <p>${a}</p>
        </div>
        </div>
        `;
  });
};

FAQMaker();
