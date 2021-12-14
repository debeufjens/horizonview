const drawCanvas = function () {
    var canvas = document.getElementById('myCanvas');
    const ctx = canvas.getContext('2d');
    ctx.canvas.width = 4000;
    ctx.canvas.height = 2000;

    var background = new Image();
    background.src = 'dawn4000x2000.jpeg';

    background.onload = function () {
        ctx.drawImage(background, 0, 0);

        var img = new Image();
        img.src = 'sun.png';
        img.onload = function () {
            ctx.drawImage(img, 500, 500, 60, 60);
            drawPano(canvas);
        };
    };
};

const drawPano = function (canv) {
    var imagePano = canv.toDataURL('image/jpeg');

    const panorama = new PANOLENS.ImagePanorama(imagePano);
    const viewer = new PANOLENS.Viewer({ output: 'console' });
    viewer.add(panorama);
};

document.addEventListener('DOMContentLoaded', function () {
    drawCanvas();
});
