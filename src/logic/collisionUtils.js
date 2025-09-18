import * as THREE from 'three';

export function boundingBoxesIntersect(objectA, objectB) {
  const boxA = new THREE.Box3();
  boxA.setFromObject(objectA);
  const boxB = new THREE.Box3();
  boxB.setFromObject(objectB);
  return boxA.intersectsBox(boxB);
}

export function isRowNear(rowA, rowB) {
  return rowA === rowB || rowA === rowB + 1 || rowA === rowB - 1;
}
