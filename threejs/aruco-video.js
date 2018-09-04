var runAruco = function (scene, camera, renderer, cubeGeometry, cubeMaterial) {
    let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
    let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
    let cap = new cv.VideoCapture(video);

    let markerImage = new cv.Mat();
    let dictionary = new cv.Dictionary(cv.DICT_6X6_250);
    let markerIds = new cv.Mat();
    let markerCorners = new cv.MatVector();
    let rvecs = new cv.Mat();
    var rvec;
    let tvecs = new cv.Mat();
    let cameraMatrix = cv.matFromArray(3, 3, cv.CV_64F, [9.6635571716090658e+02, 0., 2.0679307818305685e+02, 0.,
        9.6635571716090658e+02, 2.9370020600555273e+02, 0., 0., 1.]);
    let distCoeffs = cv.matFromArray(5, 1, cv.CV_64F, [-1.5007354215536557e-03, 9.8722389825801837e-01,
        1.7188452542408809e-02, -2.6805958820424611e-02, -2.3313928379240205e+00]);

    const FPS = 30;
    function processVideo() {
        try {
            
            renderer.render(scene, camera);
            cubeMaterial[0].opacity = 0;
            cubeMaterial[1].opacity = 0;
            cubeMaterial[2].opacity = 0;
            cubeMaterial[3].opacity = 0;
            cubeMaterial[4].opacity = 0;
            cubeMaterial[5].opacity = 0;

            cap.read(src);
            cv.cvtColor(src, dst, cv.COLOR_RGBA2RGB, 0);


            let begin = Date.now();
            // start processing.

            cv.detectMarkers(dst, dictionary, markerCorners, markerIds);
            if (markerIds.rows > 0) {
                cv.drawDetectedMarkers(dst, markerCorners, markerIds);
                cv.estimatePoseSingleMarkers(markerCorners, 0.1, cameraMatrix, distCoeffs, rvecs, tvecs);
                for (let i = 0; i < markerIds.rows; ++i) {
                    let rvec = cv.matFromArray(3, 1, cv.CV_64F, [rvecs.doublePtr(0, i)[0], rvecs.doublePtr(0, i)[1], rvecs.doublePtr(0, i)[2]]);
                    let tvec = cv.matFromArray(3, 1, cv.CV_64F, [tvecs.doublePtr(0, i)[0], tvecs.doublePtr(0, i)[1], tvecs.doublePtr(0, i)[2]]);
                    cv.drawAxis(dst, cameraMatrix, distCoeffs, rvec, tvec, 0.1);
                    rvec.delete();
                    tvec.delete();
                }

                // starts top left, then goes clockwise
                for (let j = 0; j < markerCorners.get(0).data32F.length; j += 2) {
                    cv.circle(
                        dst,
                        new cv.Point(markerCorners.get(0).data32F[j], markerCorners.get(0).data32F[j + 1]),
                        3,
                        new cv.Scalar(255, 0, 0)
                    );
                }

                // Normalize z rotation i.e. rvec
                if (rvecs.data64F[0] < -0.2)
                    rvec = -0.2;
                else if (rvecs.data64F[0] > 0.2)
                    rvec = 0.2;
                else
                    rvec = rvecs.data64F[0];
                
/*
                // Top Right Front
                cubeGeometry.vertices[0].x = (((markerCorners.get(0).data32F[2] / video.width) * 8.0) - 3.0)
                // Make Top Right Front rotate vertex based on angle of aruco marker
                cubeGeometry.vertices[0].y = ( ((markerCorners.get(0).data32F[3] / video.height) * -6.0) + 3.0 ) + (rvecs.data64F[0] / 2);
                // Top Right Back
                cubeGeometry.vertices[1].x = ((markerCorners.get(0).data32F[2] / video.width) * 8.0) - 3.0;
                cubeGeometry.vertices[1].y = ((markerCorners.get(0).data32F[3] / video.height) * -6.0) + 3.0;
                // Bottom Right Front
                cubeGeometry.vertices[2].x = ((markerCorners.get(0).data32F[4] / video.width) * 8.0) - 3.0;
                // Make Bottom Right Front rotate vertex based on angle of aruco marker
                cubeGeometry.vertices[2].y = ( ((markerCorners.get(0).data32F[5] / video.height) * -6.0) + 3.0 ) + (rvecs.data64F[0] / 2);
                // Bottom Right Back
                cubeGeometry.vertices[3].x = ((markerCorners.get(0).data32F[4] / video.width) * 8.0) - 3.0;
                cubeGeometry.vertices[3].y = ((markerCorners.get(0).data32F[5] / video.height) * -6.0) + 3.0;
                // Top Left Back
                cubeGeometry.vertices[4].x = ((markerCorners.get(0).data32F[0] / video.width) * 6.0) - 4.0
                cubeGeometry.vertices[4].y = ((markerCorners.get(0).data32F[1] / video.height) * -6.0) + 3.0;
                // Top Left Front
                cubeGeometry.vertices[5].x = ((markerCorners.get(0).data32F[0] / video.width) * 6.0) - 4.0
                // Make Top Left Front rotate vertex based on angle of aruco marker
                cubeGeometry.vertices[5].y = ( ((markerCorners.get(0).data32F[1] / video.height) * -6.0) + 3.0 ) + (rvecs.data64F[0] / 2);
                // Bottom Left Back
                cubeGeometry.vertices[6].x = ((markerCorners.get(0).data32F[6] / video.width) * 6.0) - 4.0;
                cubeGeometry.vertices[6].y = ((markerCorners.get(0).data32F[7] / video.height) * -6.0) + 3.0;
                // Bottom Left Front
                cubeGeometry.vertices[7].x = ((markerCorners.get(0).data32F[6] / video.width) * 6.0) - 4.0;
                // Make Bottom Left Front rotate vertex based on angle of aruco marker
                cubeGeometry.vertices[7].y = ( ((markerCorners.get(0).data32F[7] / video.height) * -6.0) + 3.0) + (rvecs.data64F[0] / 2);
*/
                cubeMaterial[0].opacity = 0.7;
                cubeMaterial[1].opacity = 0.7;
                cubeMaterial[2].opacity = 0.7;
                cubeMaterial[3].opacity = 0.7;
                cubeMaterial[4].opacity = 0.7;
                cubeMaterial[5].opacity = 0.7;
                //cubeMaterial.parameters.depth = 5;
                // CubeGeometry start top right (TL = -5,-5 ; TR = 5,5) - markerCorners start top left (TL = 0,0 ; TR = 300,0)
                // Top Right Front
                cubeGeometry.vertices[0].x = ((((markerCorners.get(0).data32F[2]/video.width) * 2) - 1) * 3);
                cubeGeometry.vertices[0].y = ((((markerCorners.get(0).data32F[3]/video.height) * -2) + 1) * 1.2) + (rvec);
                // Top Right Back
                cubeGeometry.vertices[1].x = ((((markerCorners.get(0).data32F[2]/video.width) * 2) - 1) * 9);
                cubeGeometry.vertices[1].y = ((((markerCorners.get(0).data32F[3]/video.height) * -2) + 1) * 3.5) - (2 + rvec);

                // Bottom Right Front
                cubeGeometry.vertices[2].x = ((((markerCorners.get(0).data32F[4]/video.width) * 2) - 1) * 3);
                cubeGeometry.vertices[2].y = ((((markerCorners.get(0).data32F[5]/video.height) * -2) + 1) * 1.2) + (rvec);
                // Bottom Right Back
                cubeGeometry.vertices[3].x = ((((markerCorners.get(0).data32F[4]/video.width) * 2) - 1) * 9);
                cubeGeometry.vertices[3].y = ((((markerCorners.get(0).data32F[5]/video.height) * -2) + 1) * 3.5) - (2 + rvec);

                // Top Left Front
                cubeGeometry.vertices[5].x = ((((markerCorners.get(0).data32F[0]/video.width) * 2) - 1) * 3);
                cubeGeometry.vertices[5].y = ((((markerCorners.get(0).data32F[1]/video.height) * -2) + 1) * 1.2) + (rvec);
                // Top Left Back
                cubeGeometry.vertices[4].x = ((((markerCorners.get(0).data32F[0]/video.width) * 2) - 1) * 9);
                cubeGeometry.vertices[4].y = ((((markerCorners.get(0).data32F[1]/video.height) * -2) + 1) * 3.5) - (2 + rvec);

                // Bottom Left Front
                cubeGeometry.vertices[7].x = ((((markerCorners.get(0).data32F[6]/video.width) * 2) - 1) * 3);
                cubeGeometry.vertices[7].y = ((((markerCorners.get(0).data32F[7]/video.height) * -2) + 1) * 1.2) + (rvec);
                // Bottom Left Back
                cubeGeometry.vertices[6].x = ((((markerCorners.get(0).data32F[6]/video.width) * 2) - 1) * 9);
                cubeGeometry.vertices[6].y = ((((markerCorners.get(0).data32F[7]/video.height) * -2) + 1) * 3.5) - (2 + rvec);
                
                cubeGeometry.verticesNeedUpdate = true;
                
            }

            cv.imshow('aruco', dst);

            // schedule the next one.
            let delay = 1000 / FPS - (Date.now() - begin);
            setTimeout(processVideo, delay);
        } catch (err) {
            console.error(err);
        }
    };

    processVideo();
}