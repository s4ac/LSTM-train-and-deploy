const yano = ml5.LSTMGenerator('models/intelligence/', modelReadyYano);
const darwin = ml5.LSTMGenerator('models/shelley/', modelReadyDarwin);

const synth = window.speechSynthesis;
console.log(synth.getVoices());
function speak(speech_text) {
  // first we check wether the argument is text or an object
  // if it is an object than we use the inner text of the question
  let sp_text = speech_text;
  if (typeof speech_text === 'object') {
      sp_text = current_question;
  }
  const speech = new SpeechSynthesisUtterance(sp_text);

  // const cool_voices_names = ['Bad News', 'Cellos', 'Pipe Organ']
  // const cool_voices_names = ['Anna', 'Luca', 'Thomas'];
  const cool_voices_names = ['Serena', 'Kate'];
  const voices_list = synth.getVoices().filter(result => {
      for (const voice of cool_voices_names) {
          if (result.name === voice) return result;
      }
      // if(result.lang.includes('en'))return result
  });
  const random_idx = Math.floor(Math.random() * voices_list.length);
  const voice = voices_list[random_idx];
  console.log(voice.name);
  speech.voice = voice;
  // speech.rate = 0.1;
  speech.volume = 1;
  synth.speak(speech);
}

const type_speed = 55;

let id = 0;
let stop = false;

function modelReadyYano() {
  console.log('data')
  // select('#status').html('Model Loaded');
  let data = {
    seed: 'What is the meaning of life?',
    temperature: 0.3,
    length: 150
  };

  // Generate text with the yano
  yano.generate(data, gotDataYano);
}

function modelReadyDarwin() {
  console.log('ready')
}

let id_P = 0;

// here we write yano's text
let IntervalYano;
let writeYano = true;
let indexYano = 0;
let generatedTextYano = ''
function gotDataYano(result) {
  if (!stop) {
    id_P++;
    // console.log('yano');
    indexYano = 0;
    writeYano = true;
    generatedTextYano = result.generated;
    speak(result.generated);
    let p = document.createElement('div');
    $(p).addClass('yano')
    .attr('id', id_P.toString(16));
    $('#content').append(p);
    // let txt = '';
    if (generatedTextYano != '') {
      IntervalYano = setInterval(() => {
        let myDiv = document.getElementById('content');
        let myP = document.getElementById(id_P.toString(16));
        if (writeYano) {
          let letter = generatedTextYano[indexYano];
          // txt += letter;
          myP.innerHTML += letter;
          myDiv.scrollTop = myDiv.scrollHeight;
          indexYano++;
        }
        if (indexYano >= generatedTextYano.length) {
          writeYano = false;          
          clearInterval(IntervalYano);
          darwin.generate(data(result.generated), gotDataDarwin);
        }
      }, type_speed);
    }
  }
}


// here we write yano's text
let IntervalDarwin;
let writeDarwin = true;
let indexDarwin = 0;
let generatedTextDarwin = '';
function gotDataDarwin(result) {
  if (!stop) {
    id_P++;
    // console.log('yano');
    indexDarwin = 0;
    writeDarwin = true;
    generatedTextDarwin = result.generated;
    speak(result.generated);
    let p = document.createElement('div');
    $(p).addClass('darwin')
    .attr('id', id_P.toString(16));
    $('#content').append(p);
    // let txt = '';
    if (generatedTextDarwin != '') {
      IntervalDarwin = setInterval(() => {
        let myDiv = document.getElementById('content');
        let myP = document.getElementById(id_P.toString(16));
        if (writeDarwin) {
          let letter = generatedTextDarwin[indexDarwin];
          // txt += letter;
          myP.innerHTML += letter;
          myDiv.scrollTop = myDiv.scrollHeight;
          indexDarwin++;
        }
        if (indexDarwin >= generatedTextDarwin.length) {
          writeDarwin = false;          
          clearInterval(IntervalDarwin);
          console.log('start yano');
          yano.generate(data(result.generated), gotDataYano);
        }
      }, type_speed);
    }
  }
}




function setup() {
  noCanvas();
}

function data(seed_text) {
  return {
    seed: seed_text,
    // temperature: 0.5 + (Math.random() * 0.5),
    temperature: 1,
    length: Math.floor(Math.random() * 350)
  }
}
