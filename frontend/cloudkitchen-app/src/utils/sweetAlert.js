import Swal from "sweetalert2";

const customClass = {
  popup: "cloud-sweet-alert",
  confirmButton: "cloud-sweet-alert__confirm",
};

export const showSuccessAlert = (message, options = {}) =>
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: message,
    showConfirmButton: false,
    timer: 3200,
    timerProgressBar: true,
    customClass,
    ...options,
  });

export const showErrorAlert = (message, title = "Something went wrong") =>
  Swal.fire({
    icon: "error",
    title,
    text: message,
    confirmButtonText: "Got it",
    buttonsStyling: false,
    customClass,
  });