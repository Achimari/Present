const steps = [
	{ video: "https://achimari.github.io/Present/videos/1.MP4", answers: ["кухня", "иисус"] },
	{ video: "https://achimari.github.io/Present/videos/2.MP4", answers: ["ванная", "иисус"] },
	{ video: "https://achimari.github.io/Present/videos/3.MP4", answers: ["лестница", "иисус"] },
	{ video: "https://achimari.github.io/Present/videos/4.MP4", answers: ["коробка", "иисус"] }
];

let currentStep = 0;
let firstInteraction = false;

const container = document.querySelector(".container");
const videoEl = document.getElementById("video");
const inputEl = document.getElementById("answer");
const nextBtn = document.getElementById("nextBtn");

const bgMusic = new Audio("song.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.4;

const errorSound = new Audio("error.mp3");
errorSound.preload = "auto";

document.addEventListener("click", () => {
	if (firstInteraction) return;
	firstInteraction = true;

	bgMusic.play().catch(() => {});

	videoEl.play().catch(() => {});
});

videoEl.addEventListener("play", () => {
	bgMusic.pause();
});

videoEl.addEventListener("ended", () => {
	if (firstInteraction && currentStep < steps.length) {
		bgMusic.play().catch(() => {});
	}
});

nextBtn.addEventListener("click", nextStep);

inputEl.addEventListener("keydown", (e) => {
	if (e.key === "Enter") nextStep();
});

function nextStep() {
	const userAnswer = inputEl.value.trim().toLowerCase();

	if (!userAnswer) {
		playWrongVideo();
		return;
	}

	if (steps[currentStep].answers.includes(userAnswer)) {
		const isJesus = userAnswer === "иисус";

		playSuccessEffect(isJesus);
		currentStep++;

		if (currentStep >= steps.length) {
			setTimeout(showQuestComplete, 1200);
			return;
		}

		setTimeout(() => {
			videoEl.src = steps[currentStep].video;
			videoEl.play();
			inputEl.value = "";
		}, 1200);

	} else {
		playWrongVideo();
	}
}

function playSuccessEffect(isJesus) {
	container.classList.add("success");
	inputEl.classList.add("success");
	nextBtn.classList.add("success");
	videoEl.classList.add("success");

	if (isJesus) {
		container.classList.add("jesus");
		nextBtn.classList.add("jesus");
		videoEl.classList.add("jesus");
	}

	createSparkles(nextBtn, isJesus);
	hapticTap("success");

	setTimeout(() => {
		container.classList.remove("success", "jesus");
		inputEl.classList.remove("success");
		nextBtn.classList.remove("success", "jesus");
		videoEl.classList.remove("success", "jesus");
	}, 1200);
}

function createSparkles(target, isJesus) {
	const rect = target.getBoundingClientRect();

	for (let i = 0; i < 16; i++) {
		const sparkle = document.createElement("div");
		sparkle.className = "sparkle";

		if (isJesus) {
			sparkle.style.background = "radial-gradient(circle, #ffd56a, transparent)";
		}

		const x = (Math.random() - 0.5) * 160;
		const y = (Math.random() - 0.5) * 160;

		sparkle.style.left = rect.left + rect.width / 2 + "px";
		sparkle.style.top = rect.top + rect.height / 2 + "px";
		sparkle.style.setProperty("--x", `${x}px`);
		sparkle.style.setProperty("--y", `${y}px`);

		document.body.appendChild(sparkle);
		setTimeout(() => sparkle.remove(), 1200);
	}
}

function playWrongVideo() {
	playErrorFeedback();

	videoEl.src = "https://achimari.github.io/Present/videos/wrong.mp4";
	videoEl.play();

	videoEl.onended = () => {
		videoEl.src = steps[currentStep].video;
		videoEl.play();
		videoEl.onended = null;
	};
}

function playErrorFeedback() {
	container.classList.add("error");
	inputEl.classList.add("error");

	try {
		errorSound.currentTime = 0;
		errorSound.play();
	} catch (_) {}

	hapticTap("error");

	setTimeout(() => {
		container.classList.remove("error");
		inputEl.classList.remove("error");
	}, 600);
}

function hapticTap(type) {
	if (!("vibrate" in navigator)) return;

	if (type === "success") {
		navigator.vibrate([20]);
	} else if (type === "error") {
		navigator.vibrate([40, 30, 40]);
	}
}

function showQuestComplete() {
	bgMusic.currentTime = 0;
	bgMusic.play().catch(() => {});

	const overlay = document.createElement("div");
	overlay.className = "quest-complete";

	const content = document.createElement("div");
	content.className = "quest-complete-content";

	content.innerHTML = `
		<h1>Квест завершён</h1>
		<p>Ты дошёл до конца 🔥</p>
	`;

	overlay.appendChild(content);
	document.body.appendChild(overlay);

	createSparkles(content, true);
	hapticTap("success");
}
