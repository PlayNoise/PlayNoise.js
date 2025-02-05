// instrumentSelector.test.js

import { instrument } from "../../src/instruments/instrumentSelector.js";
import PN from "../../src/pn.js";
import { Instruments } from "../../src/instruments/instruments.js";

// Mock the Instruments class and its methods
jest.mock("../../src/instruments/instruments.js", () => {
  return {
    Instruments: jest.fn().mockImplementation(() => ({
      Trumpet: jest.fn().mockReturnValue("trumpet"),
      ThickBass: jest.fn().mockReturnValue("thickbass"),
      FunckLead: jest.fn().mockReturnValue("funcklead"),
      Organ60: jest.fn().mockReturnValue("organ60"),
      Banjo: jest.fn().mockReturnValue("banjo"),
      Cello: jest.fn().mockReturnValue("cello"),
      AcousticGuitar: jest.fn().mockReturnValue("AcousticGuitarInstance"),
    })),
  };
});

// Mock the PN object
jest.mock("../../src/pn.js", () => ({
  currentInstrument: null,
}));

describe("instrumentSelector", () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    Instruments.mockClear();
    PN.currentInstrument = null;
  });

  it('should set PN.currentInstrument to Trumpet when instrumentName is "trumpet"', () => {
    instrument("trumpet");
    expect(PN.currentInstrument).toBe("trumpet");
  });

  it('should set PN.currentInstrument to ThickBass when instrumentName is "thickbass"', () => {
    instrument("thickbass");
    expect(PN.currentInstrument).toBe("thickbass");
  });

  it('should set PN.currentInstrument to FunckLead when instrumentName is "funcklead"', () => {
    instrument("funcklead");
    expect(PN.currentInstrument).toBe("funcklead");
  });

  it('should set PN.currentInstrument to Organ60 when instrumentName is "organ60"', () => {
    instrument("organ60");
    expect(PN.currentInstrument).toBe("organ60");
  });

  it('should set PN.currentInstrument to Banjo when instrumentName is "banjo"', () => {
    instrument("banjo");
    expect(PN.currentInstrument).toBe("banjo");
  });

  it('should set PN.currentInstrument to Cello when instrumentName is "cello"', () => {
    instrument("cello");
    expect(PN.currentInstrument).toBe("cello");
  });

  it('should log "Instrument not found!" and not set PN.currentInstrument when instrumentName is unknown', () => {
    console.log = jest.fn(); // Mock console.log
    instrument("unknown");
    expect(console.log).toHaveBeenCalledWith("Instrument not found!");
    expect(PN.currentInstrument).toBeNull();
  });
});
