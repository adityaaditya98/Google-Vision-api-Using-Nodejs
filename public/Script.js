const imageInput = document.getElementById('imageInput');
const previewArea = document.getElementById('preview');
console.log(imageInput);
console.log(preview);
imageInput.onchange = function(e) {
    const file = e.target.files[0];
    if(file) {
      const previewImage = document.createElement('img');
      previewImage.src = URL.createObjectURL(file);
      previewArea.innerHTML = '';
      previewArea.appendChild(previewImage);
    }
};