import { expect } from 'chai';
import sinon from 'sinon';
import axios from 'axios';
import * as easybrokerService from '../../src/services/easybrokerService.js';

describe('easybrokerService', () => {
    describe('getPropertyDetails', () => {
        let axiosGetStub;

        beforeEach(() => {
            axiosGetStub = sinon.stub(axios, 'get');
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should return property details for a valid propertyId', async () => {
            const mockData = { id: 'valid_id', title: 'Mock Property' };
            axiosGetStub.resolves({ data: mockData });

            const propertyDetails = await easybrokerService.getPropertyDetails('valid_id');
            expect(propertyDetails).to.deep.equal(mockData);
        });

        it('should throw an error for an invalid propertyId', async () => {
            try {
                await easybrokerService.getPropertyDetails('');
            } catch (error) {
                expect(error.message).to.equal('Invalid property ID');
            }
        });
    });
});
