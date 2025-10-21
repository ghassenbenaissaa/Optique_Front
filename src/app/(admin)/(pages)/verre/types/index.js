// Énumération des matériaux de verre compatibles avec les valeurs utilisées dans les composants
export const MateriauVerre = {
  MINERAL: 'Minéral',
  ORGANIQUE: 'Organique',
  POLYCARBONATE: 'Polycarbonate',
  TRIVEX: 'Trivex',
  HI_INDEX: 'Hi-Index',
};

export const MateriauVerreLabels = {
  [MateriauVerre.MINERAL]: 'Minéral',
  [MateriauVerre.ORGANIQUE]: 'Organique',
  [MateriauVerre.POLYCARBONATE]: 'Polycarbonate',
  [MateriauVerre.TRIVEX]: 'Trivex',
  [MateriauVerre.HI_INDEX]: 'Hi-Index',
};

/**
 * @typedef {Object} Verre
 * @property {number} [id]
 * @property {string} type
 * @property {number} indice
 * @property {keyof typeof MateriauVerre | string} materiau
 * @property {number} basePrice
 * @property {boolean} [isAvailable]
 */
