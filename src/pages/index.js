import "../pages/index.css";
import {
  enableValidation,
  resetValidation,
  disableButton,
  settings,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";
import { setButtonText } from "../utils/helpers.js";
import logoImage from "../images/Logo.svg";
import avatarImage from "../images/spots-images/avatar.jpg";
import pencilIcon from "../images/Group2.svg";
import plusIcon from "../images/Group26.svg";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "831e4e00-d632-4331-89f8-8527ffc2584c",
    "Content-Type": "application/json",
  },
});

let selectedCard;
let selectedCardId;

const editProfileButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editProfileCloseButton = editProfileModal.querySelector(
  ".modal__close-button",
);
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector(
  "#profile-name-input",
);
const editProfileDescriptionInput = editProfileModal.querySelector(
  "#profile-description-input",
);

const newPostButton = document.querySelector(".profile__new-post-button");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseButton = newPostModal.querySelector(".modal__close-button");
const newPostForm = newPostModal.querySelector(".modal__form");
const cardImageInput = document.querySelector("#card-image-input");
const cardCaptionInput = document.querySelector("#card-caption-input");
const cardSubmitButton = newPostModal.querySelector(".modal__submit-button");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");
const profileAvatarEl = document.querySelector(".profile__avatar");

const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".card");
const cardsListEl = document.querySelector(".cards__list");

const previewModal = document.querySelector("#preview-modal");
const previewModalImage = previewModal.querySelector(".modal__image");
const previewModalCaption = previewModal.querySelector(".modal__caption");
const previewModalCloseButton = previewModal.querySelector(
  ".modal__close-button",
);

const avatarModal = document.querySelector("#edit-avatar-modal");
const avatarModalCloseButton = avatarModal.querySelector(
  ".modal__close-button",
);
const avatarForm = avatarModal.querySelector(".modal__form");
const avatarInput = document.querySelector("#avatar-input");
const avatarModalButton = document.querySelector(".profile__avatar-button");
const avatarSubmitButton = avatarModal.querySelector(".modal__submit-button");

const deleteModal = document.querySelector("#delete-modal");
const deleteModalCloseButton = deleteModal.querySelector(
  ".modal__close-button",
);
const deleteModalCancelButton = deleteModal.querySelector(
  ".modal__cancel-button",
);
const deleteForm = deleteModal.querySelector(".modal__form");

const headerLogoEl = document.querySelector(".header__logo");
const editButtonIconEl = document.querySelector(".profile__edit-button img");
const newPostButtonIconEl = document.querySelector(
  ".profile__new-post-button img",
);
const avatarPencilIconEl = document.querySelector(".profile__pencil-icon");

const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Golden Gate Bridge",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
  },
];

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_is-opened");
    if (openedModal) {
      closeModal(openedModal);
    }
  }
}

function handleOverlayClick(evt) {
  if (evt.target.classList.contains("modal")) {
    closeModal(evt.target);
  }
}

function openModal(modal) {
  modal.classList.add("modal_is-opened");
  document.addEventListener("keydown", handleEscape);
  modal.addEventListener("click", handleOverlayClick);
}

function closeModal(modal) {
  modal.classList.remove("modal_is-opened");
  document.removeEventListener("keydown", handleEscape);
  modal.removeEventListener("click", handleOverlayClick);
}

function getCardElement(data) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardTitleEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-button");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-button");

  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;
  cardTitleEl.textContent = data.name;

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-button_active");
  }

  cardLikeBtn.addEventListener("click", (evt) => {
    handleLikeCard(evt, data._id);
  });

  cardDeleteBtn.addEventListener("click", () => {
    handleDeleteCard(cardElement, data);
  });

  cardImageEl.addEventListener("click", () => {
    previewModalImage.src = data.link;
    previewModalImage.alt = data.name;
    previewModalCaption.textContent = data.name;
    openModal(previewModal);
  });

  return cardElement;
}

function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  openModal(deleteModal);
}

function handleLikeCard(evt, cardId) {
  const isLiked = evt.target.classList.contains("card__like-button_active");

  api
    .changeLikeStatus(cardId, isLiked)
    .then(() => {
      evt.target.classList.toggle("card__like-button_active");
    })
    .catch((err) => {
      console.error(err);
    });
}

editProfileButton.addEventListener("click", function () {
  editProfileNameInput.value = profileNameEl.textContent;
  editProfileDescriptionInput.value = profileDescriptionEl.textContent;
  resetValidation(
    editProfileForm,
    [editProfileNameInput, editProfileDescriptionInput],
    settings,
  );
  openModal(editProfileModal);
});

editProfileCloseButton.addEventListener("click", function () {
  closeModal(editProfileModal);
});

newPostButton.addEventListener("click", function () {
  openModal(newPostModal);
});

newPostCloseButton.addEventListener("click", function () {
  closeModal(newPostModal);
});

previewModalCloseButton.addEventListener("click", function () {
  closeModal(previewModal);
});

avatarModalButton.addEventListener("click", function () {
  openModal(avatarModal);
});

avatarModalCloseButton.addEventListener("click", function () {
  closeModal(avatarModal);
});

deleteModalCloseButton.addEventListener("click", function () {
  closeModal(deleteModal);
});

deleteModalCancelButton.addEventListener("click", function () {
  closeModal(deleteModal);
});

function handleEditProfileSubmit(event) {
  event.preventDefault();
  const submitButton = event.submitter;

  setButtonText(submitButton, true);

  api
    .editUserInfo({
      name: editProfileNameInput.value,
      about: editProfileDescriptionInput.value,
    })
    .then((data) => {
      profileNameEl.textContent = data.name;
      profileDescriptionEl.textContent = data.about;
      closeModal(editProfileModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonText(submitButton, false);
    });
}

function handleAddCardSubmit(event) {
  event.preventDefault();
  const submitButton = event.submitter;

  setButtonText(submitButton, true);

  api
    .addCard({
      name: cardCaptionInput.value,
      link: cardImageInput.value,
    })
    .then((data) => {
      const cardElement = getCardElement(data);
      cardsListEl.prepend(cardElement);
      newPostForm.reset();
      disableButton(cardSubmitButton, settings);
      closeModal(newPostModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonText(submitButton, false);
    });
}

function handleAvatarSubmit(event) {
  event.preventDefault();
  const submitButton = event.submitter;

  setButtonText(submitButton, true);

  api
    .editAvatar(avatarInput.value)
    .then((data) => {
      profileAvatarEl.src = data.avatar;
      avatarForm.reset();
      disableButton(avatarSubmitButton, settings);
      closeModal(avatarModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonText(submitButton, false);
    });
}

function handleDeleteSubmit(event) {
  event.preventDefault();
  const submitButton = event.submitter;

  setButtonText(submitButton, true, "Deleting...", "Delete");

  api
    .removeCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      closeModal(deleteModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonText(submitButton, false, "Deleting...", "Delete");
    });
}

editProfileForm.addEventListener("submit", handleEditProfileSubmit);
newPostForm.addEventListener("submit", handleAddCardSubmit);
avatarForm.addEventListener("submit", handleAvatarSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);

api
  .getAppInfo()
  .then(([cards, userData]) => {
    // Set user info
    profileNameEl.textContent = userData.name;
    profileDescriptionEl.textContent = userData.about;
    profileAvatarEl.src = userData.avatar;

    // Render cards
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsListEl.append(cardElement);
    });
  })
  .catch((err) => {
    console.error(err);
  });

enableValidation(settings);

headerLogoEl.src = logoImage;
editButtonIconEl.src = pencilIcon;
newPostButtonIconEl.src = plusIcon;
avatarPencilIconEl.src = pencilIcon;
