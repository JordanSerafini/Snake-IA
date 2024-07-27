import * as tf from '@tensorflow/tfjs';

export function createModel() {
  const model = tf.sequential();
  model.add(tf.layers.dense({ inputShape: [11], units: 256, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 256, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 4, activation: 'softmax' })); 
  
  model.compile({
    optimizer: tf.train.adam(),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  });

  return model;
}

