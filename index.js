// Rules for ping pong game are :
// 1. Rode will score 10 points for every successful hit
// 2. Rode will score 10 points for acquiring ball speed decrease power (green ball)
// 3. Rode score will be decreased by 10 points if it acquires ball speed increase(red ball) or bat speed decrease power(red hand)
// 4. Winner is decided: when ball hits the wall then it’s a win for another player, it is not decided by score.

// Logic for ball movement
// is that considering every surface to be horizontally or vertically i.e they are at 90 degrees to each other
// theta taken is measured along the y-axis
// so by right angled triangle even if ball hits vertical or horizontal surface
// the top coordinate of ball will change by cos component of theta and left coordinate of ball will change by sin component multiplied by ball speed
// just ball direction will depend if top or left coordinate of ball will be decreasing or increasing

// Rod1 and top bat
// and Rod2 and bottom bat are same

{
  // bat variable for two rodes
  let bat = document.getElementsByClassName("bat");
  // ball variable for ball
  let ball = document.getElementById("ball");
  // powers variable for different powers visible after certain interval
  let powers = document.getElementById("powers");
  // container variable for playable area marked by black border
  let container = document.getElementById("container");
  // width for bat/rode
  let batWidth = bat[0].offsetWidth;
  // height for bat/rode
  let batHeight = bat[0].offsetHeight;
  // two edge variables to detect if ball contacts any edge
  // be -> bottom bat edges
  let be = 0;
  // te ->top bat edges
  let te = 0;
  // variable to maintain score for rode 1/ top bat
  let scoreRode1 = 0;
  // variable to maintain score for rode 2/ bottom bat
  let scoreRode2 = 0;
  // maximumScore to maintain maximum score
  let maximumScore = localStorage.getItem("maxScore");
  let maxScore;
  // power turn variable to alternate power direction in opposite direction
  let powerTurn = 1;
  // winner variable to detect the winner for current round
  let winner = "1";
  // id for power animation set interval function
  let powerAnimeId;
  // left to set the restriction on movement of bats/rodes
  let left;
  // id for ball speed increase set interval function
  let ballSpeedIncreaseId;
  // bat speed variable to specify speed at which bats or rodes will move
  let batSpeed = 2;
  // ball speed variable to specify speed at which ball will move
  let ballSpeed = 1;
  // containerWidth variable to know offset width of container(playarea)
  let containerWidth = container.offsetWidth;
  // containerHeight variable to know offset width of container(playarea)
  let containerHeight = container.offsetHeight;
  // w to set initial position of bats to be at the middele of container
  let w = (containerWidth - batWidth) / 2;
  // giving initial position of bats to left variable
  left = w;
  // currentBatStrike variable to know where ball has striked recently
  let currentBatStrike = "bottom";
  // ballCoord variable to get the coordinates of ball
  let ballCoord = ball.getBoundingClientRect();
  // ballTop for top coordinate of ball
  let ballTop = ballCoord.top;
  // ballLeft for left coordinate of ball
  let ballLeft = ballCoord.left;
  // thetaCurr variable to first randomly generate a angle for ball movement at start then change according to law of reflection
  let thetaCurr = Math.random() * 55 + 10;
  // gameStart variable to know if game has started
  let gameStart = false;
  // l and t variable to help detect direction for ball as initially ball will move at thetaCurr angle and towards right of screen as l is positive meaning left coordinate of ball will be increased
  // and t is negative meaning top coordinate of ball will be decreased
  let l = "+";
  let t = "-";
  // gameEnd variable to know if game has ended
  let gameEnd = false;
  // batCoord to detect coordintes of bats/rodes
  let batCoord = bat[0].getBoundingClientRect();
  // setting the initial position of bats to be at center of container
  for (let i = 0; i < bat.length; i++) {
    bat[i].style.left = w + "px";
  }
  // setting the initial position of ball on top of rode 2 and middle of it
  ball.style.top = containerHeight - batHeight - ball.offsetHeight - 6 + "px";
  ball.style.left = (containerWidth - ball.offsetWidth) / 2 + "px";

  // reset function to reset all properties and variables to their initial values

  function reset() {
    bat[0].style.backgroundColor = "blue";
    bat[1].style.backgroundColor = "purple";
    powerTurn = 1;
    scoreRode1 = 0;
    scoreRode2 = 0;
    ball.style.backgroundColor = "red";
    ball.style.display = "block";
    gameStart = false;
    batSpeed = 2;
    ballSpeed = 1;
    be = 0;
    te = 0;
    batCoord = bat[0].getBoundingClientRect();
    w = (containerWidth - batWidth) / 2;
    for (let i = 0; i < bat.length; i++) {
      bat[i].style.left = w + "px";
    }
    left = w;
    batHeight = bat[0].offsetHeight;
    // checking winner and positioning ball at start of every match accordingly as looser gets the ball
    if (winner == "1") {
      ball.style.top =
        containerHeight - batHeight - ball.offsetHeight - 6 + "px";
      l = "+";
      t = "-";
      currentBatStrike = "bottom";
    } else if (winner == "2") {
      ball.style.top = batHeight + 4 + "px";
      l = "-";
      t = "+";
      currentBatStrike = "top";
    }

    ball.style.left = (containerWidth - ball.offsetWidth) / 2 + "px";
    ballCoord = ball.getBoundingClientRect();
    ballTop = ballCoord.top;
    ballLeft = ballCoord.left;
    thetaCurr = Math.random() * 55 + 10;
    gameStart = false;
    gameEnd = false;
    powers.style.display = "none";
  }

  // function to increase ball speed by 0.001px at every 200ms interval
  function ballSpeedIncrease() {
    ballSpeedIncreaseId = setInterval(function () {
      // setting the limit of ball speed to be less than 2.5
      if (ballSpeed > 2.5) {
        clearInterval(ballSpeedIncreaseId);
      } else {
        ballSpeed += 0.005;
      }
    }, 500);
  }
  // powers animation function to animate the alternate movement of powers in up and down direction
  function powersAnimationHelper() {
    powerTurn++;
    if (gameEnd) {
      clearInterval(powerAnimeId);
    } else {
      // setting random initial starting left position of powers
      let powersPost = Math.random() * 90 + 5;
      powers.style.left = powersPost + "%";
      // setting top position of powers the at middle
      let powersTop = 50;
      powers.style.top = powersTop + "%";
      // getting the coordinates of powers
      let powersCoord = powers.getBoundingClientRect();
      // powers array to contain name of different powers
      let powersArray = ["slowBallSpeed", "incBallSpeed", "slowBatSpeed"];
      // generating a random number between 0 to 2 to randomly get powers from powersArray
      let i = Math.random() * 3;
      i = Math.floor(i);
      // giving font awesome icons and colors to different powers
      if (powersArray[i] == "slowBallSpeed") {
        powers.innerHTML = '<i class="fa-solid fa-bowling-ball"></i>';
        powers.style.color = "green";
      } else if (powersArray[i] == "incBallSpeed") {
        powers.innerHTML = '<i class="fa-solid fa-bowling-ball"></i>';
        powers.style.color = "red";
      } else if (powersArray[i] == "slowBatSpeed") {
        powers.innerHTML = '<i class="fa-solid fa-hand"></i>';
        powers.style.color = "red";
      }
      // making powers visible
      powers.style.display = "block";
      // animating movement of powers alternatively up and down
      let powerId = setInterval(function () {
        if (powersTop >= 100 || powersTop <= -20) {
          clearInterval(powerId);
        } else {
          powersCoord = powers.getBoundingClientRect();
          if (powerTurn % 2 == 0) {
            // setting the conditions when powers come in contact of rode 2
            if (
              powersCoord.top >= containerHeight - batHeight + 10 &&
              powersCoord.right >= batCoord.left &&
              powersCoord.left <= batCoord.right
            ) {
              // making powers invisible after contact
              powers.style.display = "none";

              // decresing ball speed for some time interval
              if (powersArray[i] == "slowBallSpeed") {
                let tmp = ballSpeed;
                ballSpeed = 0.6;
                // increasing score of rode 2 for acquiring decresing ball speed power
                scoreRode2 += 10;
                // changing color of ball for the time it's speed is decreased
                ball.style.backgroundColor = "cyan";

                let p2 = setInterval(function () {
                  // changing back to old properties after power interval is over
                  ballSpeed = tmp;
                  ball.style.backgroundColor = "red";
                  clearInterval(p2);
                }, 5000);
              }
              // decresing ball speed for some time interval
              else if (powersArray[i] == "incBallSpeed") {
                // storing current value of ball speed
                let tmp = ballSpeed;
                ballSpeed = 2;
                // decreasing points of rode 2 according to rule
                scoreRode2 -= 10;
                ball.style.backgroundColor = "yellow";

                let p3 = setInterval(function () {
                  // changing back to old properties after power interval is over
                  ballSpeed = tmp;
                  ball.style.backgroundColor = "red";

                  clearInterval(p3);
                }, 5000);
              }
              // slowing bat speed for some interval
              else if (powersArray[i] == "slowBatSpeed") {
                batSpeed = 1;
                // decreasing points of rode 2 according to rule
                scoreRode2 -= 10;
                for (let i = 0; i < bat.length; i++) {
                  // changing background Color for rodes to grey as their speed decreases for some interval
                  bat[i].style.backgroundColor = "grey";
                }
                let p1 = setInterval(function () {
                  // changing back to old properties after power interval is over
                  batSpeed = 2;
                  bat[0].style.backgroundColor = "blue";
                  bat[1].style.backgroundColor = "purple";
                  clearInterval(p1);
                }, 5000);
              }
            }
            // increasing top coordinate of powers for down movement
            powersTop += 0.1;
            powers.style.top = powersTop + "%";
          } else {
            // setting the conditions when powers come in contact of rode 1
            if (
              powersCoord.top <= batHeight - 10 &&
              powersCoord.right >= batCoord.left &&
              powersCoord.left <= batCoord.right
            ) {
              powers.style.display = "none";

              if (powersArray[i] == "slowBallSpeed") {
                let tmp = ballSpeed;
                ballSpeed = 0.6;
                scoreRode1 += 10;
                ball.style.backgroundColor = "cyan";

                let p2 = setInterval(function () {
                  ballSpeed = tmp;
                  ballSpeedIncrease();
                  ball.style.backgroundColor = "red";

                  clearInterval(p2);
                }, 5000);
              } else if (powersArray[i] == "incBallSpeed") {
                scoreRode1 -= 10;
                let tmp = ballSpeed;
                ballSpeed = 2;
                ball.style.backgroundColor = "yellow";
                let p3 = setInterval(function () {
                  ballSpeed = tmp;
                  ball.style.backgroundColor = "red";

                  ballSpeedIncrease();
                  clearInterval(p3);
                }, 5000);
              } else if (powersArray[i] == "slowBatSpeed") {
                batSpeed = 1;
                scoreRode1 -= 10;
                for (let i = 0; i < bat.length; i++) {
                  bat[i].style.backgroundColor = "grey";
                }

                let p1 = setInterval(function () {
                  batSpeed = 2;
                  bat[0].style.backgroundColor = "blue";
                  bat[1].style.backgroundColor = "purple";
                  clearInterval(p1);
                }, 5000);
              }
            }
            // decreasing top coordinate of powers for up movement
            powersTop -= 0.1;
            powers.style.top = powersTop + "%";
          }
        }
      }, 1);
    }
  }
  function powersAnimation() {
    powerAnimeId = setInterval(powersAnimationHelper, 10000);
  }
  // function for ball movement
  let ballMovement = function () {
    let id = setInterval(ballAnimation, 1);
    function ballAnimation() {
      // condition if ball touches the horizontal wall and the match ends
      if (ballTop + ball.offsetWidth < 0 || ballTop > containerHeight) {
        // if ball touches the top wall winner is rode 2
        if (ballTop + ball.offsetWidth < 0) {
          winner = "2";
        }
        // else if it touches the bottom wall winner is rode 1
        else {
          winner = "1";
        }

        // game has ended at this point so that gameStart is false and gameEnd is true
        gameStart = false;
        gameEnd = true;
        // clearing all the intervals after every game end
        clearInterval(powerAnimeId);
        clearInterval(id);
        clearInterval(ballSpeedIncreaseId);
        ball.style.display = "none";
        // storing the value of scores in temporary variable before resting them
        let tmp1 = scoreRode1;
        let tmp2 = scoreRode2;

        maxScore = localStorage.getItem("maxScore");

        // updating value of maximum score if any score exceeds it
        if (tmp1 >= tmp2) {
          if (maxScore !== "null") {
            if (tmp1 > maxScore) {
              localStorage.setItem("maxScore", scoreRode1);
              localStorage.setItem(scoreRode1, "Rode 1");
            }
          } else {
            localStorage.setItem("maxScore", scoreRode1);
            localStorage.setItem(scoreRode1, "Rode 1");
          }
        } else if (tmp2 > tmp1) {
          if (maxScore !== "null") {
            if (tmp2 > maxScore) {
              localStorage.setItem("maxScore", scoreRode2);
              localStorage.setItem(scoreRode2, "Rode 2");
            }
          } else {
            localStorage.setItem("maxScore", scoreRode2);
            localStorage.setItem(scoreRode2, "Rode 2");
          }
        }
        // reseting the variables and properties
        reset();
        // showing result after every game
        alert(
          "Rode " +
            winner +
            " wins \n" +
            "\nScore of rode 1 is : " +
            tmp1 +
            " and \nScore of rode 2 is : " +
            tmp2 +
            "\nMax score is : " +
            localStorage.getItem("maxScore")
        );
      }
      // else if ball touches the vertical walls or the rodes
      else {
        // getting the coordinates of ball and bats
        ballCoord = ball.getBoundingClientRect();
        batCoord = bat[0].getBoundingClientRect();

        //   condition for if ball touches any of the four edges of rodes/bats
        if (
          /*rode 2 left edge*/ (ballCoord.top >=
            containerHeight - batHeight - 2 - ball.offsetHeight &&
            ballCoord.right - batCoord.left <= 1.5 &&
            ballCoord.right - batCoord.left >= 0 &&
            ballCoord.top <= containerHeight - batHeight - ball.offsetHeight &&
            t == "+" &&
            l == "+") ||
          /*rode 2 right edge*/ (ballCoord.top >=
            containerHeight - batHeight - 2 - ball.offsetHeight &&
            ballCoord.top <= containerHeight - batHeight - ball.offsetHeight &&
            batCoord.right - ballCoord.left <= 1.5 &&
            batCoord.right - ballCoord.left >= 0 &&
            t == "+" &&
            l == "-") ||
          /*rode 1 left edge*/ (ballCoord.right - batCoord.left <= 1.5 &&
            ballCoord.right - batCoord.left >= 0 &&
            ballCoord.top >= batHeight &&
            ballCoord.top <= batHeight + 2 &&
            t == "-" &&
            l == "+") ||
          /*rode 1 left edge*/ (batCoord.right - ballCoord.left <= 1.5 &&
            batCoord.right - ballCoord.left >= 0 &&
            ballCoord.top >= batHeight &&
            ballCoord.top <= batHeight + 2 &&
            t == "-" &&
            l == "-")
        ) {
          if (
            /*rode 2 left edge*/ (ballCoord.top >=
              containerHeight - batHeight - 2 - ball.offsetHeight &&
              ballCoord.right - batCoord.left <= 1.5 &&
              ballCoord.right - batCoord.left >= 0 &&
              ballCoord.top <=
                containerHeight - batHeight - ball.offsetHeight &&
              t == "+" &&
              l == "+") ||
            /*rode 2 right edge*/ (ballCoord.top >=
              containerHeight - batHeight - 2 - ball.offsetHeight &&
              ballCoord.top <=
                containerHeight - batHeight - ball.offsetHeight &&
              batCoord.right - ballCoord.left <= 1.5 &&
              batCoord.right - ballCoord.left >= 0 &&
              t == "+" &&
              l == "-")
          ) {
            // rod 2 edge is occured so te=0 and be=1
            scoreRode2 += 10;
            currentBatStrike = "bottom";
            be = 1;
            te = 0;
          } else if (
            /*rode 1 left edge*/ (ballCoord.right - batCoord.left <= 1.5 &&
              ballCoord.right - batCoord.left >= 0 &&
              ballCoord.top >= batHeight &&
              ballCoord.top <= batHeight + 2 &&
              t == "-" &&
              l == "+") ||
            /*rode 1 right edge*/ (batCoord.right - ballCoord.left <= 1.5 &&
              batCoord.right - ballCoord.left >= 0 &&
              ballCoord.top >= batHeight &&
              ballCoord.top <= batHeight + 2 &&
              t == "-" &&
              l == "-")
          ) {
            // rod 1 edge is occured so te=1 and be=0
            te = 1;
            scoreRode1 += 10;
            currentBatStrike = "top";
            be = 0;
          }
          // if ball touches edge it goes in exact opposite direction and both l and t changes sign
          if (t == "+") {
            t = "-";
          } else if (t == "-") {
            t = "+";
          }
          if (l == "+") {
            l = "-";
          } else if (l == "-") {
            l = "+";
          }
        }
        // if in any exception case ball completely enters the bat it disappears and ends the game
        else if (
          (ballCoord.top >= containerHeight - batHeight + 2 &&
            ballCoord.right < batCoord.right - 18.2 &&
            ballCoord.left > batCoord.left + 18.2) ||
          (ballCoord.right < batCoord.right - 18.2 &&
            ballCoord.left > batCoord.left + 18.2 &&
            ballCoord.top <= batHeight - 2 - ball.offsetHeight)
        ) {
          ball.style.top = "-50px";
          ballTop = -50;
          ball.style.display = "none";
        }

        //    if ball touches the vertical ends of rodes/bats
        // I given the margin of 18.2 pixels inside the bat because as speed of bat is 20 pixels per movement so if for instance ball moves inside the bat as ball is moving at very less speed in comparison to bat
        else if (
          /* rode 2 left end */ (ballCoord.top >
            containerHeight - batHeight - ball.offsetHeight &&
            ballCoord.left >= batCoord.left - 2 - ball.offsetWidth &&
            ballCoord.right <= batCoord.left + 18.2) ||
          /*rode 2 right end */ (ballCoord.top >
            containerHeight - batHeight - ball.offsetHeight &&
            ballCoord.right <= batCoord.right + 2 + ball.offsetWidth &&
            ballCoord.left >= batCoord.right - 18.2) ||
          /*rode 1 left end */ (ballCoord.top < batHeight &&
            ballCoord.left >= batCoord.left - 2 - ball.offsetWidth &&
            ballCoord.right <= batCoord.left + 18.2) ||
          /* rode 1 right end */ (ballCoord.top < batHeight &&
            ballCoord.right <= batCoord.right + 2 + ball.offsetWidth &&
            ballCoord.left >= batCoord.right - 18.2)
        ) {
          if (
            ballCoord.left >= batCoord.left - 2 - ball.offsetWidth &&
            ballCoord.right <= batCoord.left + 18.2
          ) {
            if (l == "-") {
              // in this case ball is hitting the bat when it is going away from the bat
              // in this case ball will be going at a higher speed after hitting
              if (t == "+") {
                ballTop =
                  ballTop +
                  3 * ballSpeed * Math.cos(thetaCurr * (Math.PI / 180));
                ballLeft =
                  ballLeft -
                  3 * ballSpeed * Math.sin(thetaCurr * (Math.PI / 180));
                ball.style.top = ballTop + "px";
                ball.style.left = ballLeft + "px";
              } else if (t == "-") {
                ballTop =
                  ballTop -
                  3 * ballSpeed * Math.cos(thetaCurr * (Math.PI / 180));
                ballLeft =
                  ballLeft -
                  3 * ballSpeed * Math.sin(thetaCurr * (Math.PI / 180));
                ball.style.top = ballTop + "px";
                ball.style.left = ballLeft + "px";
              }
            } else if (l == "+") {
              // in this case ball is hitting the bat when it is going towards the bat
              // so the left sign is changed to have reflection
              l = "-";
            }
          } else if (
            ballCoord.right <= batCoord.right + 2 + ball.offsetWidth &&
            ballCoord.left >= batCoord.right - 18.2
          ) {
            if (l == "+") {
              // in this case ball is hitting the bat when it is going away from the bat
              // in this case ball will be going at a higher speed after hitting
              if (t == "+") {
                ballTop =
                  ballTop +
                  3 * ballSpeed * Math.cos(thetaCurr * (Math.PI / 180));
                ballLeft =
                  ballLeft +
                  3 * ballSpeed * Math.sin(thetaCurr * (Math.PI / 180));
                ball.style.top = ballTop + "px";
                ball.style.left = ballLeft + "px";
              } else if (t == "-") {
                ballTop =
                  ballTop -
                  3 * ballSpeed * Math.cos(thetaCurr * (Math.PI / 180));
                ballLeft =
                  ballLeft +
                  3 * ballSpeed * Math.sin(thetaCurr * (Math.PI / 180));
                ball.style.top = ballTop + "px";
                ball.style.left = ballLeft + "px";
              }
            } else if (l == "-") {
              // in this case ball is hitting the bat when it is going towards the bat
              // so the left sign is changed to have reflection
              l = "+";
            }
          }
          te = 0;
          be = 0;
        }

        // ball hitting the bats/rodes
        else if (
          /*ball hitting rode 2 */ (ballCoord.right > batCoord.left &&
            ballCoord.left < batCoord.right &&
            ballCoord.top >=
              containerHeight - batHeight - 2 - ball.offsetHeight &&
            be == 0) ||
          /*ball hitting rode 1 */ (ballCoord.right > batCoord.left &&
            ballCoord.left < batCoord.right &&
            ballCoord.top <= batHeight + 2 &&
            te == 0)
        ) {
          // ball hitting rode 2
          te = 0;
          be = 0;
          if (
            ballCoord.right > batCoord.left &&
            ballCoord.left < batCoord.right &&
            ballCoord.top >= containerHeight - batHeight - 2 - ball.offsetHeight
          ) {
            // if previous hit bat is top one
            if (currentBatStrike == "top") {
              // neither of the edge is hit by ball so te and be=0
              te = 0;
              be = 0;

              // increasing the score of rode 2
              scoreRode2 += 10;

              // changing the sign of t to get reflection effect
              if (t == "+") {
                t = "-";
              } else if (t == "-") {
                t = "+";
              }
              // as current hit bat is top
              currentBatStrike = "bottom";
            }
          }
          // ball hitting rode 1
          else if (
            ballCoord.right > batCoord.left &&
            ballCoord.left < batCoord.right &&
            ballCoord.top <= batHeight + 2
          ) {
            // if previous hit bat is bottom one
            if (currentBatStrike == "bottom") {
              // neither of the edge is hit by ball so te and be=0

              te = 0;
              be = 0;
              // increasing the score of rode 1
              scoreRode1 += 10;

              // changing the sign of t to get reflection effect
              if (t == "+") {
                t = "-";
              } else if (t == "-") {
                t = "+";
              }
              // as current hit bat is top
              currentBatStrike = "top";
            }
          }
        }

        // ball hitting the vertical walls of container
        // changing only the sign of l
        else if (ballCoord.right >= containerWidth || ballLeft <= 0) {
          te = 0;
          be = 0;

          if (l == "+") {
            l = "-";
          } else if (l == "-") {
            l = "+";
          }
        }

        // now we know the direction the ball is going to move
        // what we have to do is just the ball movement by the logic explained earlier on line 8
        if (t == "+") {
          if (l == "+") {
            ballTop =
              ballTop + ballSpeed * Math.cos(thetaCurr * (Math.PI / 180));
            ballLeft =
              ballLeft + ballSpeed * Math.sin(thetaCurr * (Math.PI / 180));
            ball.style.top = ballTop + "px";
            ball.style.left = ballLeft + "px";
          } else if (l == "-") {
            ballTop =
              ballTop + ballSpeed * Math.cos(thetaCurr * (Math.PI / 180));
            ballLeft =
              ballLeft - ballSpeed * Math.sin(thetaCurr * (Math.PI / 180));
            ball.style.top = ballTop + "px";
            ball.style.left = ballLeft + "px";
          }
        } else if (t == "-") {
          if (l == "+") {
            ballTop =
              ballTop - ballSpeed * Math.cos(thetaCurr * (Math.PI / 180));
            ballLeft =
              ballLeft + ballSpeed * Math.sin(thetaCurr * (Math.PI / 180));
            ball.style.top = ballTop + "px";
            ball.style.left = ballLeft + "px";
          } else if (l == "-") {
            ballTop =
              ballTop - ballSpeed * Math.cos(thetaCurr * (Math.PI / 180));
            ballLeft =
              ballLeft - ballSpeed * Math.sin(thetaCurr * (Math.PI / 180));
            ball.style.top = ballTop + "px";
            ball.style.left = ballLeft + "px";
          }
        }
      }
    }
  };

  // add event listener function so
  // 1. Every round should start when the 'Enter' key is pressed.
  // 2. The rods will only move horizontally using the 'a' and 'd' keys.
  document.addEventListener("keypress", function (event) {
    // a pressed
    if (event.keyCode == 97) {
      if (gameStart) {
        if (left > 0) {
          if (left <= batSpeed * 10) {
            left = 0;
          } else {
            left = left - batSpeed * 10;
          }

          for (let i = 0; i < bat.length; i++) {
            bat[i].style.left = left + "px";
          }
        }
      }
    }
    //d pressed
    else if (event.keyCode == 100) {
      if (gameStart) {
        if (batCoord.right <= containerWidth) {
          batCoord = bat[0].getBoundingClientRect();
          if (batCoord.right >= containerWidth - batSpeed * 10) {
            left = containerWidth - batWidth;
          } else {
            left = left + batSpeed * 10;
          }

          for (let i = 0; i < bat.length; i++) {
            bat[i].style.left = left + "px";
          }
        }
      }
    }
  });
  document.addEventListener("keydown", function (event) {
    // enter pressed
    if (event.keyCode == 13) {
      if (!gameStart) {
        maximumScore = localStorage.getItem("maxScore");
        // checking if game is played for first time or not and telling the rules at start of match
        if (maximumScore != null) {
          if (maximumScore == 0) {
            alert(
              "Maximum score is : " +
                maximumScore +
                "\nRules are :\n1. Rode will score 10 points for every successful hit \n2. Rode will score 10 points for acquiring ball speed decrease power (green ball) \n3. Rode score will be decreased by 10 points if it acquires ball speed increase(red ball) or bat speed decrease power(red hand) \n4. Winner is decided: when ball hits the wall then it’s a win for another player, it is not decided by score.  "
            );
          } else {
            alert(
              "Maximum score is : " +
                maximumScore +
                " and scored by " +
                localStorage.getItem(maximumScore) +
                "\nRules are :\n1. Rode will score 10 points for every successful hit \n2. Rode will score 10 points for acquiring ball speed decrease power (green ball) \n3. Rode score will be decreased by 10 points if it acquires ball speed increase(red ball) or bat speed decrease power(red hand) \n4. Winner is decided: when ball hits the wall then it’s a win for another player, it is not decided by score.  "
            );
          }
        } else {
          alert(
            "This is your first time playing \nRules are :\n1. Rode will score 10 points for every successful hit \n2. Rode will score 10 points for acquiring ball speed decrease power (green ball) \n3. Rode score will be decreased by 10 points if it acquires ball speed increase(red ball) or bat speed decrease power(red hand) \n4. Winner is decided: when ball hits the wall then it’s a win for another player, it is not decided by score"
          );
          localStorage.setItem("maxScore", 0);
        }
        reset();
        gameStart = true;
        gameEnd = false;
        ballSpeedIncrease();
        ballMovement();
        powersAnimation();
      }
    }
  });
}
