module.exports = {
    plugins: ['prettier-plugin-tailwindcss'],
  }


  document.addEventListener('DOMContentLoaded', function () {
    // Add an event listener to the form submission
    document.getElementById('upload-form').addEventListener('submit', function (e) {
        // Clear the file input after submission
        document.getElementById('image').value = '';
    });
});
