'use strict';

import scores from './scores.js';
import gradings from './gradings.js';

const weightedChoose = (scores, skew) => {
  const options = scores
    .map(s => Array((s.avgScore ** skew).toFixed(1) * 10).fill(s.game))
    .flat();
  const chosenGame = options[Math.floor(Math.random() * options.length)];
  return scores.reduce((curr, prev) => (curr.game === chosenGame ? curr : prev));
};

const graded = (game, gradings) => {
  return {
    ...game,
    grading : gradings.reduce(
      (curr, prev) => (game.avgScore >= curr.rating && curr.rating > prev.rating ? curr : prev),
      { rating: 0 },
    ),
  };
};

const updateInfo = (elementsObj, newData) => {
  elementsObj.gameName.textContent = newData.game;
  elementsObj.partyPack.textContent = newData.partyPack;
  elementsObj.choiceComm.textContent = newData.comment;
  elementsObj.avgScore.textContent = newData.avgScore;
  elementsObj.scoreComm.textContent = newData.grading.text;
  elementsObj.scoreImg.setAttribute('src', 'img/' + newData.grading.img);
  elementsObj.scoreImg.setAttribute('alt', newData.grading.text);
};

const sleep = ms => new Promise(res => setTimeout(res, ms))

const fadeTransition = async (div, elementsObj, newData, func) => {
  div.classList.add('hidden');
  await sleep(200)
  func(elementsObj, newData);
  let counter = 0;
  while (!elementsObj.scoreImg.complete) {
    await sleep(50);
    counter++;
    if (counter >= 20) break;
  }
  div.classList.remove('hidden')
};

const skew = 1;

const roll = document.getElementById('roll');
const resultsBox = document.getElementById('results');
const gameEls = {
  gameName   : document.getElementById('name'),
  partyPack  : document.getElementById('partypack'),
  choiceComm : document.getElementById('choicecomm'),
  avgScore   : document.getElementById('avgscore'),
  scoreComm  : document.getElementById('scorecomm'),
  scoreImg   : document.getElementById('scoreimg'),
};

roll.addEventListener('click', function () {
  const game = graded(weightedChoose(scores, skew), gradings);
  fadeTransition(resultsBox, gameEls, game, updateInfo);
});
