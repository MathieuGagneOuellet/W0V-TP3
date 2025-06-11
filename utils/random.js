const aleatoire = {
  obtientNombreAleatoire(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  },
  obtientElementAleatoire(array) {
    return array[Math.floor(Math.random() * array.length)];
  },
  obtientTypeAleatoire(effetTypes) {
    const aleatoire = effetTypes.sort(() => 0.5 - Math.random());
    return aleatoire.slice(0, Math.floor(Math.random() * 2) + 1);
  }
}
export default aleatoire;


