import { DATA } from "../server/db.js";

// documentdan ma'lumotlarni olish
const headerStatus = document.querySelector(".header__status"),
    content = document.querySelector(".content"),
    contentImage = document.querySelector(".content__image"),
    form = document.querySelector(".form"),
    [text, imageLabel] = form.children,
    [imageIcon, image] = imageLabel.children;

// vaqtni olish
let date = new Date(),
    hours = date.getHours(),
    minutes = date.getMinutes();

const audio = new Audio("../sounds/in_the_chat_receive_message.mp3");

// vaqtni yangilash
const updateTime = () => {
    date = new Date();
    hours = date.getHours();
    minutes = date.getMinutes();
};

image.addEventListener("change", (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
        imageIcon.style.color = "#f00";
        const reader = new FileReader();
        reader.onload = () => {
            text.focus();
            localStorage.setItem("image", reader.result);
        };
        reader.readAsDataURL(file);
    }
});

contentImage.addEventListener("click", () => {
    send("", "./images/hello.png");
});

const send = async (message = "", image = "", isMyMessage = true) => {
    if (message.trim() || image) {
        updateTime();
        contentImage.style.display = "none";
        const div = document.createElement("div");
        headerStatus.textContent = "online";
        headerStatus.style.color = "dodgerblue";
        if (image && message) {
            image = await fetch(image)
                .then((res) => res.blob())
                .then((data) => URL.createObjectURL(data));
            div.innerHTML = `<div class="image-wrapper">
                <img src="${image}">
                <p>${message}</p>
                <span>${hours}:${minutes}</span>
            </div>`;
            div.className = `message ${
                isMyMessage && "my-message"
            } message-image with-text`;
            imageIcon.style.color = "#fff";
            localStorage.removeItem("image");
        } else if (image) {
            image = await fetch(image)
                .then((res) => res.blob())
                .then((data) => URL.createObjectURL(data));
            div.innerHTML = `<div class="image-wrapper">
                <img src="${image}">
                <span>${hours}:${minutes}</span>
            </div>`;
            div.className = `message ${
                isMyMessage && "my-message"
            } message-image`;
            imageIcon.style.color = "#fff";
            localStorage.removeItem("image");
        } else if (message) {
            div.className = `message ${isMyMessage && "my-message"} `;
            div.innerHTML = `<p>${message}</p>
                <span>${hours}:${minutes}</span>`;
        }
        audio.play();
        content.appendChild(div);
        form.reset();
        isMyMessage && botMessage();
    }
    setTimeout(autoScroll, 1);
};

const botMessage = () => {
    const botSelect = DATA[Math.floor(Math.random() * DATA.length)];
    setTimeout(() => {
        headerStatus.textContent = "online";
        headerStatus.style.color = "dodgerblue";
    }, 500);
    if (botSelect.type === "text") {
        setTimeout(() => {
            headerStatus.textContent = "typing. . .";
        }, 700);
    } else {
        setTimeout(() => {
            headerStatus.textContent = "sending image. . .";
        }, 700);
    }

    setTimeout(() => {
        if (botSelect.type === "text") {
            send(botSelect.content, "", false);
        } else if (botSelect.type === "image") {
            send("", botSelect.content, false);
        } else if (botSelect.type === "image-with-text") {
            send(botSelect.content[1], botSelect.content[0], false);
        }
    }, Math.floor(Math.random() * 3000));
};

function autoScroll() {
    content.scrollTop = content.scrollHeight;
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    send(text.value.trimStart().trimEnd(), localStorage.getItem("image"));
});
