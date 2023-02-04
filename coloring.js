const bWidth = document.documentElement.clientWidth;
const bHeight = document.documentElement.clientHeight;
const margins = (bWidth * 0.5) / 2;
var drawingApp = (function() {

    "use strict";

    var contexts = {},
        context,ctx,
        context2,
        canvas,canvass, outline,
        undoCounter = 1,
        bcounter,Obj,
        cPushArray = new Array(),
        cStep = -1,
        canvasWidth = bWidth * 0.5 - 150,
        canvasHeight = bHeight - (bHeight * 0.2),
        outlineImage = new Image(),
        crayonImage = new Image(),
        markerImage = new Image(),
        penImage = new Image(),
        pencilImage = new Image(),
        brushImage = new Image(),
        eraserImage = new Image(),
        bucketImage = new Image(),
        freeImage = new Image(),
        undoImage = new Image(),
        crayonBackgroundImage = new Image(),
        markerBackgroundImage = new Image(),
        eraserBackgroundImage = new Image(),
        crayonTextureImage = new Image(),
        clickX = [],
        clickY = [],
        clickColor = [],
        clickTool = [],
        clickSize = [],
        clickDrag = [],
        paint = false,
        curTool = "pencil",
        curSize = "small",
        curMethod = "freecolor",
        padding = 20,
        mediumStartX = 18,
        mediumStartY = bHeight * 0.15,
        mediumImageWidth = 30,
        mediumImageHeight = 30,
        drawingAreaX = (bWidth * 0.1),
        drawingAreaY = bHeight - 50,
        drawingAreaWidth = Math.round(bWidth * 0.5),
        drawingAreaHeight = Math.round(bHeight - 130),
        toolHotspotStartY = bHeight * 0.15,
        toolHotspotHeight = 38,
        sizeHotspotStartY = 200,
        sizeHotspotHeight = 36,
        sizeLineStartY = 228,
        totalLoadResources = 7,
        curLoadResNum = 0,
        sizeHotspotWidthObject = {
            huge: 39,
            large: 25,
            normal: 18,
            small: 16
        },

        swatchImage = new Image(),
        swatchImageWidth = 93,
        swatchImageHeight = 46,
        colorLayerData,
        outlineLayerData,
        bucketBackgroundImage = new Image(),
        colorRed = {
            r: 255,
            g: 27,
            b: 27
        },
        colorOrange = {
            r: 255,
            g: 157,
            b: 0
        },
        colorYellow = {
            r: 255,
            g: 242,
            b: 49
        },
        colorLightGreen = {
            r: 169,
            g: 255,
            b: 84
        },
        colorGreen = {
            r: 0,
            g: 106,
            b: 25
        },
        colorBlue = {
            r: 20,
            g: 200,
            b: 255
        },
        colorLightBlue = {
            r: 32,
            g: 107,
            b: 255
        },
        colorBrown = {
            r: 139,
            g: 69,
            b: 19
        },
        colorPurple = {
            r: 141,
            g: 27,
            b: 255
        },
        colorPink = {
            r: 251,
            g: 49,
            b: 255
        },
        colorLightBrown = {
            r: 255,
            g: 184,
            b: 128
        },
        colorBlack = {
            r: 0,
            g: 0,
            b: 0
        },
        colorWhite = {
            r: 255,
            g: 255,
            b: 255
        },
        colorPencil = {
            r: 105,
            g: 105,
            b: 105
        },
        colorMarker = {
            r: 198,
            g: 255,
            b: 141
        },
        curColor = colorGreen,

        drawColorPallete = function(contxt, color, drawX, drawY) {
            var context = contxt;
            context.beginPath();
            context.arc(drawX, drawY, 20, 0, 2 * Math.PI, false);
            //console.log(color);
            context.fillStyle = "#" + color;
            context.fill();
            context.lineWidth = 5;
            context.strokeStyle = "#" + color;

            context.stroke();
            context.closePath();
        },
        imgData = [],

        drawbColorPallete = function(contxt, color, drawX, drawY) {
            var context = contxt;
            context.beginPath();
            context.arc(drawX, drawY, 20, 0, 2 * Math.PI, false);
            //console.log(color);
            context.fillStyle = "#" + color;
            context.fill();
            context.lineWidth = 5;
            context.strokeStyle = '#000';

            context.stroke();
            context.closePath();
        },
        cPush = function() {
            cStep++;
            if (cStep < cPushArray.length) {
                cPushArray.length = cStep;
            }
            var canvas=overlayCanvas(document.getElementById('drawing'),document.getElementById('mycanvas'));
             cPushArray.push(canvas.toDataURL()); 
        },
        cUndo = function() {

            if (cStep > 0) {
                cStep--;
                var canvasPic = new Image();
                canvasPic.src = cPushArray[cStep];
                var canvas = document.getElementById('mycanvas');
                var ctx = canvas.getContext('2d');
                contexts.outline.clearRect(0, 0, contexts.outline.canvas.width, contexts.outline.canvas.height);
				contexts.drawing.clearRect(0, 0, contexts.drawing.canvas.width, contexts.drawing.canvas.height);
				
                canvasPic.onload = function() {
                    ctx.drawImage(canvasPic, 0, 0,contexts.outline.canvas.width ,contexts.outline.canvas.height);
                }




            }


        },
        clearCanvas = function() {

            contexts.drawing.clearRect(0, 0, contexts.drawing.canvas.width,  contexts.drawing.canvas.height);
			 contexts.outline.clearRect(0, 0, contexts.outline.canvas.width, contexts.outline.canvas.height);
              outlineImage.onload = function() {
                contexts.outline.drawImage(outlineImage, 0, 0, contexts.outline.canvas.width, contexts.outline.canvas.height);
            };
            outlineImage.src = "images/80.svg";  
	    },

        // Draw a color swatch
        drawColorSwatch = function(color, x, y) {

            //	context.beginPath();
            //context.arc(x + 46, y + 23, 18, 0, Math.PI * 2, true);
            //context.closePath();
            //context.fillStyle = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
            //context.fill();

            if (curColor === color) {
                //	context.drawImage(swatchImage, 0, 0, 59, swatchImageHeight, x, y, 59, swatchImageHeight);
            } else {
                //	context.drawImage(swatchImage, x, y, swatchImageWidth, swatchImageHeight);
            }
        },

        addClick = function(x, y, dragging) {

            clickX.push(x);
            clickY.push(y);
            clickTool.push(curTool);
            clickColor.push(curColor);
            clickSize.push(curSize);
            clickDrag.push(dragging);

        },

        clearClick = function() {

            clickX = [clickX[clickX.length - 1]];
            clickY = [clickY[clickY.length - 1]];
            clickTool = [clickTool[clickTool.length - 1]];

            clickColor = [clickColor[clickColor.length - 1]];

            clickSize = [clickSize[clickSize.length - 1]];
            clickDrag = [clickDrag[clickDrag.length - 1]];
        },


        // Redraws the canvas.
        redraw = function() {

            if ((document.getElementById("selectedCol").getAttribute("class")) == "selected") {
                var cc = document.getElementById("selectedCol").innerHTML.split(",");
                document.getElementById("acolor").style.backgroundColor = "rgb(" + cc[0] + "," + cc[1] + "," + cc[2] + ")";
            } else {
                document.getElementById("acolor").style.backgroundColor = "rgb(" + curColor.r + "," + curColor.g + "," + curColor.b + ")";
            }
				



var radius;


            if (curMethod === "bucket") {
                contexts.outline.putImageData(colorLayerData, 0, 0, 0, 0, canvasDiv.width, canvasDiv.height);
                paint=false;


            } else {



                if ((document.getElementById("selectedCol").getAttribute("class")) == "selected") {
                    var cc = document.getElementById("selectedCol").innerHTML.split(",");
                    curColor.r = cc[0];
                    curColor.g = cc[1];
                    curColor.b = cc[2];

                }
                if (clickX.length) {


                    var i;
                    for (i = 1; i < clickX.length; i += 1) {
						
	

                        // Set the drawing color and radius and opacity
                        if (curTool === "eraser") {

                            contexts.drawing.beginPath();
                            contexts.drawing.strokeStyle = 'white';
                            radius = 20;
                            // If dragging then draw a line between the two points
                            if (clickDrag[i] && i) {
                                contexts.drawing.moveTo(clickX[i - 1], clickY[i - 1]);
                            } else {
                                // The x position is moved over one pixel so a circle even if not dragging
                                contexts.drawing.moveTo(clickX[i] - 1, clickY[i]);
                            }
                            contexts.drawing.lineTo(clickX[i], clickY[i]);
                            contexts.drawing.lineCap = "round";
                            contexts.drawing.lineJoin = "round";
                            contexts.drawing.shadowBlur = 0;
                            contexts.drawing.lineWidth = radius;
                            contexts.drawing.stroke();
                            contexts.drawing.closePath();

                        } else if (curTool === "pen") {
                           
                            contexts.drawing.beginPath();
                            radius = 5;
                            contexts.drawing.lineWidth = radius;
                            contexts.drawing.strokeStyle = "rgba(" + clickColor[i].r + ", " + clickColor[i].g + ", " + clickColor[i].b + ", 0.7)";
                            contexts.drawing.shadowColor = "rgba(" + clickColor[i].r + ", " + clickColor[i].g + ", " + clickColor[i].b + ", 1)";
                            contexts.drawing.shadowBlur = 2;
                            contexts.drawing.lineCap = "round";
                            contexts.drawing.lineJoin = "round";
                            contexts.drawing.lineWidth = radius;
                              if (clickDrag[i] && i) {
                                contexts.drawing.moveTo(clickX[i - 1], clickY[i - 1]);
                            } else {

                                contexts.drawing.moveTo(clickX[i] - 1, clickY[i]);
                            }
                            contexts.drawing.lineTo(clickX[i], clickY[i]);

                            contexts.drawing.stroke();
                          
                           
                               var pimg = new Image();
                            pimg.src = "images/pen-txt.png";
                            // pimg.onload = function() {

                            //};
                            var pat = contexts.drawing.createPattern(pimg, "repeat");

                            contexts.drawing.strokeStyle = pat;

                            if (clickDrag[i] && i) {
                                contexts.drawing.moveTo(clickX[i - 1], clickY[i - 1]);
                            } else {


                                contexts.drawing.moveTo(clickX[i] - 1, clickY[i]);
                            }
                            contexts.drawing.lineTo(clickX[i], clickY[i]);
                             contexts.drawing.stroke();
							 
                            contexts.drawing.closePath();

                        } else if (curTool === "pencil") {


                            contexts.drawing.beginPath();
                            radius = 5;
							contexts.drawing.lineWidth = radius;
                            contexts.drawing.strokeStyle = "rgba(" + clickColor[i].r + ", " + clickColor[i].g + ", " + clickColor[i].b + ", 1)";
                            contexts.drawing.shadowColor = "rgba(" + clickColor[i].r + ", " + clickColor[i].g + ", " + clickColor[i].b + ", 1)";
                            contexts.drawing.shadowBlur = 0;
                            contexts.drawing.lineCap = "round";
                            contexts.drawing.lineJoin = "round";
                            contexts.drawing.lineWidth = radius;


                            if (clickDrag[i] && i) {
                                contexts.drawing.moveTo(clickX[i - 1], clickY[i - 1]);
                            } else {

                                contexts.drawing.moveTo(clickX[i], clickY[i]);
                            }
                            contexts.drawing.lineTo(clickX[i], clickY[i]);


                            contexts.drawing.stroke();

                            var pimg = new Image();
                            pimg.src = "images/pencil-txt.png";
                            // pimg.onload = function() {

                            //};
                            var pat = contexts.drawing.createPattern(pimg, "repeat");

                            contexts.drawing.strokeStyle = pat;

                            if (clickDrag[i] && i) {
                                contexts.drawing.moveTo(clickX[i - 1], clickY[i - 1]);
                            } else {


                                contexts.drawing.moveTo(clickX[i] - 1, clickY[i]);
                            }
                            contexts.drawing.lineTo(clickX[i], clickY[i]);


                            contexts.drawing.stroke();
                           contexts.drawing.closePath();
						   

                        } else if (curTool === "crayon") {

                            contexts.drawing.beginPath();
                            radius = 20;
                            contexts.drawing.lineWidth = radius;
                            contexts.drawing.strokeStyle = "rgba(" + clickColor[i].r + ", " + clickColor[i].g + ", " + clickColor[i].b + ", 1)";
                            contexts.drawing.shadowColor = "rgba(" + clickColor[i].r + ", " + clickColor[i].g + ", " + clickColor[i].b + ", 1)";
                            contexts.drawing.shadowBlur = 1;
                            contexts.drawing.lineCap = "round";
                            contexts.drawing.lineJoin = "round";
                            contexts.drawing.lineWidth = radius;


                            if (clickDrag[i] && i) {
                                contexts.drawing.moveTo(clickX[i - 1], clickY[i - 1]);
                            } else {

                                contexts.drawing.moveTo(clickX[i], clickY[i]);
                            }
                            contexts.drawing.lineTo(clickX[i], clickY[i]);


                            contexts.drawing.stroke();

                            var pimg = new Image();
                            pimg.src = "images/crayon-texture.png";
                            // pimg.onload = function() {

                            //};
                            var pat = contexts.drawing.createPattern(pimg, "repeat");

                            contexts.drawing.strokeStyle = pat;

                            if (clickDrag[i] && i) {
                                contexts.drawing.moveTo(clickX[i - 1], clickY[i - 1]);
                            } else {


                                contexts.drawing.moveTo(clickX[i] - 1, clickY[i]);
                            }
                            contexts.drawing.lineTo(clickX[i], clickY[i]);


                            contexts.drawing.stroke();
                            contexts.drawing.closePath();

                        } else if (curTool === "marker") {
                            contexts.drawing.beginPath();
                            radius = 20;
                              contexts.drawing.shadowColor = "rgba(" + clickColor[i].r + ", " + clickColor[i].g + ", " + clickColor[i].b + ", 1)";
                            contexts.drawing.shadowBlur = 0;


                            // If dragging then draw a line between the two points
                            if (clickDrag[i] && i) {
                                contexts.drawing.moveTo(clickX[i - 1], clickY[i - 1]);
                            } else {
                                // The x position is moved over one pixel so a circle even if not dragging
                                contexts.drawing.moveTo(clickX[i] - 1, clickY[i]);
                            }
                            contexts.drawing.lineTo(clickX[i], clickY[i]);
                            contexts.drawing.lineCap = "round";
                            contexts.drawing.lineJoin = "round";
                            contexts.drawing.lineWidth = radius;
                            contexts.drawing.strokeStyle = "rgba(" + clickColor[i].r + ", " + clickColor[i].g + ", " + clickColor[i].b + ", 1)";
                            contexts.drawing.shadowBlur = 10;
                            contexts.drawing.stroke();
                            contexts.drawing.closePath();


                        } else if (curTool === "brush") {
                          contexts.drawing.beginPath();
                            radius = 20;
                            contexts.drawing.lineWidth = radius;
                            contexts.drawing.strokeStyle = "rgba(" + clickColor[i].r + ", " + clickColor[i].g + ", " + clickColor[i].b + ", 1)";
                            contexts.drawing.shadowColor = "rgba(" + clickColor[i].r + ", " + clickColor[i].g + ", " + clickColor[i].b + ", 1)";
                            contexts.drawing.shadowBlur = 1;
                            contexts.drawing.lineCap = "round";
                            contexts.drawing.lineJoin = "round";
                            


                            if (clickDrag[i] && i) {
                                contexts.drawing.moveTo(clickX[i - 1], clickY[i - 1]);
                            } else {

                                contexts.drawing.moveTo(clickX[i], clickY[i]);
                            }
                            contexts.drawing.lineTo(clickX[i], clickY[i]);


                            contexts.drawing.stroke();
						    

                            var pimg = new Image();
                            pimg.src = "images/brush-text.png";
                            // pimg.onload = function() {

                            //};
                            var pat = contexts.drawing.createPattern(pimg, "repeat");

                            contexts.drawing.strokeStyle = pat;

                            if (clickDrag[i] && i) {
                                contexts.drawing.moveTo(clickX[i - 1], clickY[i - 1]);
                            } else {


                                contexts.drawing.moveTo(clickX[i] - 1, clickY[i]);
                            }
                            contexts.drawing.lineTo(clickX[i], clickY[i]);


                            contexts.drawing.stroke();
                            contexts.drawing.closePath();
                        }
                    }
                }




                clearClick();
            
			}


            document.getElementById('save').onclick = function() {
            var link = document.getElementById('save');
            var image = new Image();
		
              image.src = overlayCanvases(document.getElementById('drawing'),document.getElementById('mycanvas'));
              link.href = image.src; /// set data-uri as href, defaults to PNG
            link.download = 'drawing.png';
			}
            document.getElementById('undoTool').onclick = function() {

                cUndo();
            }
            document.getElementById('print').onclick = function() {
                const dataUrl =  overlayCanvases(document.getElementById('drawing'),document.getElementById('mycanvas'));
				
                var windowContent = '<!DOCTYPE html>';
                windowContent += '<html>'
                windowContent += '<head><title>Print canvas</title></head>';
                windowContent += '<body>'
                windowContent += '<img src="' + dataUrl + '">';
                windowContent += '</body>';
                windowContent += '</html>';
             const printWin = window.open('', '', 'width=' + screen.availWidth + ',height=' + screen.availHeight);
printWin.document.open();
printWin.document.write(windowContent); 

printWin.document.addEventListener('load', function() {
    printWin.focus();
    printWin.print();
    printWin.document.close();
    printWin.close();            
}, true);

            }

       

        },

        matchOutlineColor = function(r, g, b, a) {

            return (r + g + b < 100 && a === 255);
        },
        overlayCanvases = function(cnv1, cnv2) {
             var newCanvas = document.createElement('canvas'),
                 ctx = newCanvas.getContext('2d'),
                 width = cnv1.width,
                 height = cnv1.height;

             newCanvas.width = width;
             newCanvas.height = height;

             [cnv1, cnv2].forEach(function(n) {
                 ctx.beginPath();
                 ctx.drawImage(n, 0, 0, width, height);
             });

             return newCanvas.toDataURL("image/png");
        },
        overlayCanvas = function(cnv1, cnv2) {
            var newCanvas = document.createElement('canvas'),
                ctx = newCanvas.getContext('2d'),
                width = cnv2.width,
                height = cnv2.height;

            newCanvas.width = width;
            newCanvas.height = height;

            [cnv1, cnv2].forEach(function(n) {
                ctx.beginPath();
                ctx.drawImage(n, 0, 0, width, height);
            });

            return newCanvas;
        },


        matchStartColor = function(pixelPos, startR, startG, startB) {

            var r = outlineLayerData.data[pixelPos],
                g = outlineLayerData.data[pixelPos + 1],
                b = outlineLayerData.data[pixelPos + 2],
                a = outlineLayerData.data[pixelPos + 3];

            // If current pixel of the outline image is black
            if (matchOutlineColor(r, g, b, a)) {
                return false;
            }

            r = colorLayerData.data[pixelPos];
            g = colorLayerData.data[pixelPos + 1];
            b = colorLayerData.data[pixelPos + 2];

            // If the current pixel matches the clicked color
            if (r === startR && g === startG && b === startB) {
                return true;
            }

            // If current pixel matches the new color
            if (r === curColor.r && g === curColor.g && b === curColor.b) {
                return false;
            }

            // Return the difference in current color and start color within a tolerance
            return (Math.abs(r - startR) + Math.abs(g - startG) + Math.abs(b - startB) < 255);
        },

        colorPixel = function(pixelPos, r, g, b, a) {

            colorLayerData.data[pixelPos] = r;
            colorLayerData.data[pixelPos + 1] = g;
            colorLayerData.data[pixelPos + 2] = b;
            colorLayerData.data[pixelPos + 3] = a !== undefined ? a : 255;
        },

        floodFill = function(startX, startY, startR, startG, startB) {

            var newPos,
                x,
                y,
                pixelPos,
                reachLeft,
                reachRight,
                drawingBoundLeft = 0,
                drawingBoundTop = 0,
                drawingBoundRight = drawingAreaWidth - 1,
                drawingBoundBottom = drawingAreaHeight - 1,
                pixelStack = [
                    [startX, startY]
                ];
            if ((document.getElementById("selectedCol").getAttribute("class")) == "selected") {
                var cc = document.getElementById("selectedCol").innerHTML.split(",");
                curColor.r = cc[0];
                curColor.g = cc[1];
                curColor.b = cc[2];
            }
console.log("here"+drawingAreaWidth);
            while (pixelStack.length) {

                newPos = pixelStack.pop();
                x = newPos[0];
                y = newPos[1];

                // Get current pixel position
                pixelPos = (y * drawingAreaWidth + x) * 4;
				

                // Go up as long as the color matches and are inside the canvas
                while (y >= drawingBoundTop && matchStartColor(pixelPos, startR, startG, startB)) {
                    y -= 1;
                    pixelPos -= drawingAreaWidth * 4;
                }

                pixelPos += drawingAreaWidth * 4;
                y += 1;
                reachLeft = false;
                reachRight = false;

                // Go down as long as the color matches and in inside the canvas
                while (y <= drawingBoundBottom && matchStartColor(pixelPos, startR, startG, startB)) {
                    y += 1;
                    // console.log(curColor);
                    colorPixel(pixelPos, curColor.r, curColor.g, curColor.b);

                    if (x > drawingBoundLeft) {
                        if (matchStartColor(pixelPos - 4, startR, startG, startB)) {
                            if (!reachLeft) {
                                // Add pixel to stack
                                pixelStack.push([x - 1, y]);
                                reachLeft = true;
                            }
                        } else if (reachLeft) {
                            reachLeft = false;
                        }
                    }

                    if (x < drawingBoundRight) {
                        if (matchStartColor(pixelPos + 4, startR, startG, startB)) {
                            if (!reachRight) {
                                // Add pixel to stack
                                pixelStack.push([x + 1, y]);
                                reachRight = true;
                            }
                        } else if (reachRight) {
                            reachRight = false;
                        }
                    }

                    pixelPos += drawingAreaWidth * 4;
                }
            }
        },

        // Start painting with paint bucket tool starting from pixel specified by startX and startY
        paintAt = function(startX, startY) {


            var pixelPos = (startY * drawingAreaWidth + startX) * 4,
                r = colorLayerData.data[pixelPos],
                g = colorLayerData.data[pixelPos + 1],
                b = colorLayerData.data[pixelPos + 2],
                a = colorLayerData.data[pixelPos + 3];

            if (r === curColor.r && g === curColor.g && b === curColor.b) {
                // Return because trying to fill with the same color
                // console.log("shesh");
                return;
            }

            if (matchOutlineColor(r, g, b, a)) {
                // Return because clicked outline
                return;
            }
			

            floodFill(startX, startY, r, g, b);

            redraw();
        },

        createUserEvents = function() {



            var press = function(e) {
                    var mouseX = e.pageX - this.offsetLeft,
                        mouseY = e.pageY - this.offsetTop;
					// var mouseX = e.clientX,
                    //    mouseY = e.clientY;	
	
                    if (curMethod == "bucket") {
									
									colorLayerData = contexts.outline.getImageData(0, 0, drawingAreaWidth, drawingAreaHeight);
								}


                },

                drag = function(e) {
					if (curMethod == "freecolor") {
                    if (paint) {
                    var mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft,
                        mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop;

                    
                        addClick(mouseX, mouseY, true);
                        redraw();
                    }
					}
                    // Prevent the whole page from dragging if on mobile
                    e.preventDefault();
                },

                release = function() {
					if (curMethod == "freecolor") {
                    paint = false;
					}
                    redraw();
                },

                cancel = function() {
					if (curMethod == "freecolor") {
                    paint = false;
					}
                },
                pressDrawing = function(e) {

                    // Mouse down location
                    var mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft,
                        mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop;


                    if (curMethod == "freecolor") {

                        paint = true;
                        addClick(mouseX, mouseY, false);
						cPush();
                    }
					else{
						//paintAt(mouseX, mouseY);
						//$('#bucketTool').paintbucket('#canvas');
						cPush();
						
					}
					
				

                    cPush();
                    redraw();
                },

                dragDrawing = function(e) {

                    var mouseX = (e.changedTouches ? e.changedTouches[0].pageX : e.pageX) - this.offsetLeft,
                        mouseY = (e.changedTouches ? e.changedTouches[0].pageY : e.pageY) - this.offsetTop;

                    if (curMethod == "freecolor") {
						
                        if (paint) {
                            addClick(mouseX, mouseY, true);
                            redraw();
                        }
                    }

                    // Prevent the whole page from dragging if on mobile
                    e.preventDefault();
                },

                releaseDrawing = function() {

                    if (curMethod == "freecolor") {
                        paint = false;
                        redraw();
                    }
                },

                cancelDrawing = function() {
                    if (curMethod == "bucket" ){
                        paint = false;
                    }
                };
            // Add mouse event listeners to canvas element
           

            context.canvas.addEventListener("mousedown", press, false);
            context.canvas.addEventListener("mousemove", drag, false);
            context.canvas.addEventListener("mouseup", release);
            context.canvas.addEventListener("mouseout", cancel, false);

            // Add touch event listeners to canvas element
            context.canvas.addEventListener("touchstart", press, false);
            context.canvas.addEventListener("touchmove", drag, false);
            context.canvas.addEventListener("touchend", release, false);
            context.canvas.addEventListener("touchcancel", cancel, false);
	

            // Add mouse event listeners to canvas element
            contexts.outline.canvas.addEventListener("mousedown", pressDrawing, false);
            contexts.outline.canvas.addEventListener("mousemove", dragDrawing, false);
            contexts.outline.canvas.addEventListener("mouseup", releaseDrawing);
            contexts.outline.canvas.addEventListener("mouseout", cancelDrawing, false);

            // Add touch event listeners to canvas element
            contexts.outline.canvas.addEventListener("touchstart", pressDrawing, false);
            contexts.outline.canvas.addEventListener("touchmove", dragDrawing, false);
            contexts.outline.canvas.addEventListener("touchend", releaseDrawing, false);
            contexts.outline.canvas.addEventListener("touchcancel", cancelDrawing, false);


        },

        // Calls the redraw function after all neccessary resources are loaded.
        resourceLoaded = function() {


            redraw();
            createUserEvents();

        },

        // Creates a canvas element, loads images, adds events, and draws the canvas for the first time.
        init = function(width, height) {

            var canvasElement;
            var dpr = window.devicePixelRatio || 1;
           
			  document.getElementById("free-tools").style.display = "none";
			
			
			canvasElement = document.createElement('canvas');
			
			canvasElement.setAttribute('id', 'gui');
		
           canvasElement.style.height = Math.round((bHeight*0.8) - 100) + "px";
           canvasElement.style.width = Math.round(bWidth * 0.6) + "px";
		   canvasElement.style.marginTop="130px";
		    canvasElement.style.left="18%";
			 canvasElement.style.right="18%";
			document.getElementById('canvasDiv').appendChild(canvasElement);
			
			
			context = canvasElement.getContext("2d"); // Grab the 2d canvas context
            var canvasDiv=document.getElementById("gui");
            
           
           
			
			canvasElement = document.createElement('canvas');
            canvasElement.setAttribute('width', canvasDiv.style.width);
            canvasElement.setAttribute('height', canvasDiv.style.height);
            canvasElement.setAttribute('id', 'drawing');
			canvasElement.style.marginTop="130px";
		    canvasElement.style.left="18%";
			 canvasElement.style.right="18%";

            document.getElementById('canvasDiv').appendChild(canvasElement);
           
            contexts.drawing = canvasElement.getContext("2d"); // Grab the 2d canvas context
			
			canvasElement = document.createElement('canvas');
            canvasElement.setAttribute('width', parseInt(canvasDiv.style.width));
            canvasElement.setAttribute('height', parseInt(canvasDiv.style.height));
            canvasElement.setAttribute('id', 'mycanvas');
			canvasElement.style.marginTop="130px";
		    canvasElement.style.left="18%";
			 canvasElement.style.right="18%";
            document.getElementById('canvasDiv').appendChild(canvasElement); 

            contexts.outline = canvasElement.getContext("2d");
			
			
		
		
		/* 	var ctx=document.getElementById('canvas').getContext("2d");
               //backgound image
		   ctx.beginPath();
		   ctx.lineWidth = "2";
           ctx.strokeStyle = "black";
		   ctx.rect(150, 80, 400, 300);
           ctx.stroke(); */



            // set colors

            clickColor[0] = colorGreen;

            $("ul#colors li button").click(function() {
                var audio = new Audio('magic.mp3');
                audio.play();
                var color = $(this).attr("id");
                if (color == "red") {
                    curColor = colorRed;


                } else if (color == "purple") {
                    curColor = colorPurple;
                } else if (color == "pink") {
                    curColor = colorPink;
                } else if (color == "orange") {
                    curColor = colorOrange;
                } else if (color == "yellow") {
                    curColor = colorYellow;
                } else if (color == "lightgreen") {
                    curColor = colorLightGreen;
                } else if (color == "green") {
                    curColor = colorGreen;
                } else if (color == "lightbrown") {
                    curColor = colorLightBrown;
                } else if (color == "brown") {
                    curColor = colorBrown;
                } else if (color == "lightblue") {
                    curColor = colorLightBlue;
                } else if (color == "blue") {
                    curColor = colorBlue;
                } else if (color == "black") {
                    curColor = colorBlack;
                }
			
                document.getElementById("selectedCol").innerHTML = curColor.r + "," + curColor.g + "," + curColor.b;
                document.getElementById("acolor").style.backgroundColor = "rgb(" + curColor.r + "," + curColor.g + "," + curColor.b + ")";
                $('ul#colors li button').each(function() {
                    $(this).removeClass("selected");
                    $(this).addClass("deselect");
                });

                $(this).removeClass("deselect");
                $(this).addClass("selected");
            });
             $("#col-btn").click(function() {
			     var cc = document.getElementById("selectedCol").innerHTML.split(",");
				 curColor.r=cc[0];
				 curColor.g=cc[1];
				 curColor.b=cc[2];
		     document.getElementById("acolor").style.backgroundColor = "rgb(" + cc[0] + "," + cc[1] + "," + cc[2] + ")"; 
			
				 
			 });

            //click functions

            $("ul#free-tools li button").click(function() {
                var audio = new Audio('magic.mp3');
                audio.play();
                var tool = $(this).attr("id");
				 var cc = document.getElementById("selectedCol").innerHTML.split(",");
				 curColor.r=cc[0];
				 curColor.g=cc[1];
				 curColor.b=cc[2];
				 
			
                if (tool == "crayonTool") {
                   
					document.getElementById("mycanvas").style.cursor = "url('images/crayons.ico')5 15 ,auto";
					
                    curTool = "crayon";
                } else if (tool == "markerTool") {
                   document.getElementById("mycanvas").style.cursor = "url('images/highlighter.ico')5 15 ,auto";
                    curTool = "marker";
                } else if (tool == "penTool") {
                    document.getElementById("mycanvas").style.cursor = "url('images/pen.ico')5 15 ,auto";
                    curTool = "pen";
                } else if (tool == "pencilTool") {
                    document.getElementById("mycanvas").style.cursor = "url('images/pencil.ico')5 15 ,auto";
					
               
                    curTool = "pencil";
                } else if (tool == "eraserTool") {
					
					
                    document.getElementById("mycanvas").style.cursor = "url('images/eraser.png')5 15 ,auto";
					
                    curTool = "eraser";
                } else if (tool == "brushTool") {
                    document.getElementById("mycanvas").style.cursor = "url('images/brush2.png')5 15 ,auto";
				
                  
                    curTool = "brush";
                }

                $('ul#free-tools li button').each(function() {
                    $(this).removeClass("slected");
                    $(this).addClass("dselect");
					
                });


                $(this).removeClass("dselect");
                $(this).addClass("slected");
            });
            $("ul#methods li button").click(function() {
                var audio = new Audio('magic.mp3');
                audio.play();
                var tool = $(this).attr("id");
                if (tool == "bucketTool") {
                    curMethod = "bucket";
					
					$("#freeTool").removeClass("show");
					colorLayerData = contexts.outline.getImageData(0, 0, contexts.outline.canvas.width, contexts.outline.canvas.height);
					

                } else if (tool == "freeTool") {
					 document.getElementById("mycanvas").style.cursor = "url('images/pencil.ico')5 15 ,auto";
                    curMethod = "freecolor";
					$(this).toggleClass("show");
					
				

                } else if (tool == "handTool") {
                    curMethod = "freehand";
					 
  
					
                }

                if (curMethod == "bucket") {
					document.getElementById("mycanvas").style.cursor = "url('images/buckett.png')5 15 ,auto";
                    document.getElementById("free-tools").style.display = "none";

                } else {
                    document.getElementById("free-tools").style.display = "flex";

                }
				if($("#freeTool").hasClass("show") && tool != "bucketTool"){
						 document.getElementById("free-tools").style.display = "flex";
					}
					else{
						 document.getElementById("free-tools").style.display = "none";
					}
				

                $('ul#methods li button').each(function() {
					if(tool == "bucketTool" || tool == "freeTool"){
                    $(this).removeClass("slected");
                    $(this).addClass("dselect");
					}
                });

                $(this).removeClass("dselect");
                $(this).addClass("slected");
            });



            document.getElementById("deleteTool").onclick = function() {

                clearCanvas();
            };

            document.getElementById("finishTool").onclick = function() {
                document.getElementById("modal-window").style.top = 200 + "px";
                document.getElementById("modal-window").style.left = ((bWidth / 2) - 200) + "px";
                document.getElementById("overlay").style.display = "block";
            };



           
			document.getElementById("mycanvas").style.cursor = "url('images/pencil.ico')5 15 ,auto";
          
			
        
	
			
           



            var drawingCanvas = document.getElementById("drawing");

            outlineImage.onload = function() {

                 contexts.outline.drawImage(outlineImage, 0, 0, canvasElement.width, canvasElement.height);
				 
				 //contexts.drawing.drawImage(outlineImage, 0, 0, (bWidth * 0.5), (bHeight - 130));

                try {
                    outlineLayerData = contexts.outline.getImageData(0, 0, canvasElement.width, canvasElement.height);
                    colorLayerData = contexts.drawing.getImageData(0, 0, canvasElement.width, canvasElement.height);
					
                  
                } catch (ex) {
                    alert(ex);
                    //return;
                }
               // cPush();
                resourceLoaded();
            };
           outlineImage.src = "images/80.svg";
            // imgData[0] = overlayCanvases(document.getElementsByClassName("out1")[0], document.getElementsByClassName("out2")[0], document.getElementById('drawing')).replace(/^data:image\/(png|jpg);base64,/, "");
            var audio = new Audio('music.mp3');
            audio.volume = 0.2;
            //audio.play();
        };

    return {
        init: init
    };

    function g_grd(x, y) {
        var grd = context.createLinearGradient(0, 0, 50, 0);
        grd.addColorStop(0, "white");
        grd.addColorStop(1, "lightgrey");
        context.fillStyle = grd;
        context.fillRect(x, y, mediumImageWidth + 20, mediumImageHeight + 20);
        context.strokeStyle = "#d3d3d3";
        context.strokeRect(x, y, mediumImageWidth + 20, mediumImageHeight + 20);
    }
	function getpixelcolour(cx, x, y) {
  
  var pixel = cx.getImageData(x, y, 1, 1);
  var ccolor={
    r: pixel.data[0],
    g: pixel.data[1],
    b: pixel.data[2],
    a: pixel.data[3]
  };
  return ccolor;
}

    function w_grd(x, y) {
        var grd = context.createLinearGradient(0, 0, 50, 0);
        grd.addColorStop(0, "white");
        grd.addColorStop(1, "white");
        context.fillStyle = grd;
        context.fillRect(x, y, mediumImageWidth + 20, mediumImageHeight + 20);
        context.strokeStyle = "#fff";
        context.strokeRect(x, y, mediumImageWidth + 20, mediumImageHeight + 20);
    }
}());