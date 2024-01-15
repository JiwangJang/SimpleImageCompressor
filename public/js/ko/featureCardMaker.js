import { feature } from "./data.js";

const featureCardMaker = () => {
  const featureSection = document.getElementById("feature-cards");

  feature.forEach(({ feature, content, icon }) => {
    featureSection.innerHTML += `
        <div class="card">
        <img
          src="./public/icon/${icon}.svg"
          alt="${icon} 아이콘"
          class="card-icon"
        />
        <p class="card-title">${feature}</p>
        <p class="card-content">${content}</p>
      </div>
        `;
  });
};

featureCardMaker();
