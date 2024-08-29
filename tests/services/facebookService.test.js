const { expect } = require('chai');
const sinon = require('sinon');
const axios = require('axios');
const facebookService = require('../../src/services/facebookService');

describe('facebookService', () => {
    describe('publishToFacebook', () => {
        let axiosPostStub;

        beforeEach(() => {
            axiosPostStub = sinon.stub(axios, 'post');
        });

        afterEach(() => {
            sinon.restore();
        });

        it('should publish a post with images successfully', async () => {
            const mockResponse = { data: { id: 'mock_photo_id' } };
            axiosPostStub.resolves(mockResponse);

            const success = await facebookService.publishToFacebook('Test message', [{ url: 'mock_url' }], 0, 1);
            expect(success).to.be.true;
        });

        it('should retry on 504 error and eventually succeed', async () => {
            axiosPostStub.onFirstCall().rejects({ response: { status: 504 } });
            axiosPostStub.onSecondCall().resolves({ data: { id: 'mock_photo_id' } });

            const success = await facebookService.publishToFacebook('Test message', [{ url: 'mock_url' }], 0, 1);
            expect(success).to.be.true;
            expect(axiosPostStub.callCount).to.equal(2);
        });

        it('should fail after 3 retries on 504 error', async () => {
            axiosPostStub.rejects({ response: { status: 504 } });

            const success = await facebookService.publishToFacebook('Test message', [{ url: 'mock_url' }], 0, 1);
            expect(success).to.be.false;
            expect(axiosPostStub.callCount).to.equal(3);
        });
    });
});
