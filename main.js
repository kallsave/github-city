import * as THREE from "three";
import {
  fetchContributions,
  getConvertedContributions,
} from "./api";

import { createScene } from "./scene"

const { scene } = createScene();

let rowLength = -1;
let colLength = -1;

let tileTypes = [];
let seenTiles = [];

// Look through contributions and assign tileType and seenTile to all positions
export function initializeTiles(contribs) {
  tileTypes = [];
  seenTiles = [];
  colLength = contribs.length;
  rowLength = contribs[0].length;
  for (let i = 0; i < contribs.length; i++) {
    const seenRow = [];
    const typesRow = [];
    for (let j = 0; j < contribs[0].length; j++) {
      seenRow.push(0);
      typesRow.push(-1);
    }
    tileTypes.push(typesRow);
    seenTiles.push(seenRow);
  }
}

const apiContribs = await fetchContributions('kallsave', '2021');
const contribs = getConvertedContributions(apiContribs);
initializeTiles(contribs);

