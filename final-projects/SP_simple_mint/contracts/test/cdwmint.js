const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('ConfluxDevelopersWorkshopNFT', () => {
  let contract;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory('ConfluxDevelopersWorkshopNFT');
    [owner, addr1, addr2] = await ethers.getSigners();
    contract = await Contract.deploy();
    await contract.deployed();
  });

  it('should deploy the contract correctly', async () => {
    expect(contract.address).to.not.be.undefined;
  });

  it('should mint a new token', async () => {
    await contract.safeMint(addr1.address);

    const totalSupply = await contract.totalSupply();
    expect(totalSupply).to.equal(1);

    const ownerOfToken = await contract.ownerOf(0);
    expect(ownerOfToken).to.equal(addr1.address);

    const tokenURI = await contract.tokenURI(0);
    //Validate the data encoding is set correctly
    expect(tokenURI.split(",")[0]).to.equal("data:application/json;base64");
    //Validate the b64 string is terminated correctly
    expect(tokenURI.split(",")[1].slice(-1)).to.equal("=");
  });

  it('should return a valid token URI', async () => {
    await contract.safeMint(addr1.address);
    const tokenURI = await contract.tokenURI(0);
    json = JSON.parse(atob(tokenURI.split(",")[1]));
    // Validate the keys of the encoded metadata
    expect(Object.keys(json)).to.eql([ 'name', 'description', 'image', 'attributes' ]);
    expect(json.name).to.equal('CDW Onchain NFT');
    expect(json.description).to.equal('Final project for Conflux Developers Workshop');
    expect(json.image).to.equal('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSItMTAwIC0xMDAgMjAwIDIwMCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJjaXJjbGVHcmFkaWVudCIgZ3JhZGllbnRUcmFuc2Zvcm09InJvdGF0ZSg5MCkiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMwMDAwRkYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGRkE1MDAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48c3R5bGU+QGtleWZyYW1lcyBzcGluezAle3RyYW5zZm9ybTpyb3RhdGUoMGRlZyl9dG97dHJhbnNmb3JtOnJvdGF0ZSgzNjBkZWcpfX10ZXh0e3RleHQtYW5jaG9yOm1pZGRsZTtmb250LWZhbWlseTogbW9ub3NwYWNlO30jY2lyY2xle2ZpbGw6dXJsKCNjaXJjbGVHcmFkaWVudCk7c3Ryb2tlOiMwMDB9LmFuaW1hdGVkLXRleHR7YW5pbWF0aW9uOnNwaW4gNXMgbGluZWFyIGluZmluaXRlfS55ZWFyLHRleHR7ZmlsbDojMDAwfS55ZWFye2ZvbnQtc2l6ZTozMHB4O2ZvbnQtZmFtaWx5OiBtb25vc3BhY2U7fTwvc3R5bGU+PHBhdGggaWQ9ImNpcmNsZSIgZD0iTTgwIDBBODAgODAgMCAxIDAtODAgMCA4MCA4MCAwIDEgMCA4MCAwIi8+PHRleHQgY2xhc3M9ImFuaW1hdGVkLXRleHQiIGZvbnQtc2l6ZT0iMjAiPjx0ZXh0UGF0aCB4bGluazpocmVmPSIjY2lyY2xlIiBzdGFydE9mZnNldD0iNTAlIj48dHNwYW4geD0iMCIgZHk9Ii0uNWVtIj5Db25mbHV4IC0gRGV2ZWxvcGVycyAtIFdvcmtzaG9wIC0gMjAyMzwvdHNwYW4+PC90ZXh0UGF0aD48L3RleHQ+PHRleHQgY2xhc3M9InllYXIiPl5fXjwvdGV4dD48L3N2Zz4=')
    expect(json.attributes[0].trait_type).to.equal('color1');
    expect(json.attributes[1].trait_type).to.equal('color2');
    expect(json.attributes[2].trait_type).to.equal('face');
  });

  it('should only allow the owner to mint tokens', async () => {
    await expect(contract.connect(addr1).safeMint(addr1.address)).to.be.revertedWith(
      'Ownable: caller is not the owner'
    );
  });

  it('should generate unique token URIs', async () => {
    await contract.safeMint(addr1.address);
    await contract.safeMint(addr2.address);

    const tokenURI1 = await contract.tokenURI(0);
    const tokenURI2 = await contract.tokenURI(1);

    expect(tokenURI1).to.not.equal(tokenURI2);
  });


  it('should revert when minting more than the maximum supply', async () => {
    for (let i = 0; i < 100; i++) {
      await contract.safeMint(addr1.address);
    }
    await expect(contract.safeMint(addr1.address)).to.be.revertedWith('Maximum supply reached');
  });
  
  it('should emit a Transfer event when minting a new token', async () => {
    await expect(contract.safeMint(addr1.address))
      .to.emit(contract, 'Transfer')
      .withArgs(ethers.constants.AddressZero, addr1.address, 0);
  });
  
  it('should return the total supply of tokens', async () => {
    for (let i = 0; i < 5; i++) {
      await contract.safeMint(addr1.address);
    }
    const totalSupply = await contract.totalSupply();
    expect(totalSupply).to.equal(5);
  });
  
  it('should return the correct owner of a token', async () => {
    await contract.safeMint(addr1.address);
    const ownerOfToken = await contract.ownerOf(0);
    expect(ownerOfToken).to.equal(addr1.address);
  });
  
  it('should return the correct token URI', async () => {
    await contract.safeMint(addr1.address);
    const tokenURI = await contract.tokenURI(0);
    const expectedURI = 'data:application/json;base64,eyJuYW1lIjogIkNEVyBPbmNoYWluIE5GVCIsICJkZXNjcmlwdGlvbiI6ICJGaW5hbCBwcm9qZWN0IGZvciBDb25mbHV4IERldmVsb3BlcnMgV29ya3Nob3AiLCAiaW1hZ2UiOiAiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQSE4yWnlCNGJXeHVjejBpYUhSMGNEb3ZMM2QzZHk1M015NXZjbWN2TWpBd01DOXpkbWNpSUhodGJHNXpPbmhzYVc1clBTSm9kSFJ3T2k4dmQzZDNMbmN6TG05eVp5OHhPVGs1TDNoc2FXNXJJaUIyYVdWM1FtOTRQU0l0TVRBd0lDMHhNREFnTWpBd0lESXdNQ0krUEdSbFpuTStQR3hwYm1WaGNrZHlZV1JwWlc1MElHbGtQU0pqYVhKamJHVkhjbUZrYVdWdWRDSWdaM0poWkdsbGJuUlVjbUZ1YzJadmNtMDlJbkp2ZEdGMFpTZzVNQ2tpUGp4emRHOXdJRzltWm5ObGREMGlNQ1VpSUhOMGIzQXRZMjlzYjNJOUlpTXdNREF3UmtZaUx6NDhjM1J2Y0NCdlptWnpaWFE5SWpFd01DVWlJSE4wYjNBdFkyOXNiM0k5SWlOR1JrRTFNREFpTHo0OEwyeHBibVZoY2tkeVlXUnBaVzUwUGp3dlpHVm1jejQ4YzNSNWJHVStRR3RsZVdaeVlXMWxjeUJ6Y0dsdWV6QWxlM1J5WVc1elptOXliVHB5YjNSaGRHVW9NR1JsWnlsOWRHOTdkSEpoYm5ObWIzSnRPbkp2ZEdGMFpTZ3pOakJrWldjcGZYMTBaWGgwZTNSbGVIUXRZVzVqYUc5eU9tMXBaR1JzWlR0bWIyNTBMV1poYldsc2VUb2diVzl1YjNOd1lXTmxPMzBqWTJseVkyeGxlMlpwYkd3NmRYSnNLQ05qYVhKamJHVkhjbUZrYVdWdWRDazdjM1J5YjJ0bE9pTXdNREI5TG1GdWFXMWhkR1ZrTFhSbGVIUjdZVzVwYldGMGFXOXVPbk53YVc0Z05YTWdiR2x1WldGeUlHbHVabWx1YVhSbGZTNTVaV0Z5TEhSbGVIUjdabWxzYkRvak1EQXdmUzU1WldGeWUyWnZiblF0YzJsNlpUb3pNSEI0TzJadmJuUXRabUZ0YVd4NU9pQnRiMjV2YzNCaFkyVTdmVHd2YzNSNWJHVStQSEJoZEdnZ2FXUTlJbU5wY21Oc1pTSWdaRDBpVFRnd0lEQkJPREFnT0RBZ01DQXhJREF0T0RBZ01DQTRNQ0E0TUNBd0lERWdNQ0E0TUNBd0lpOCtQSFJsZUhRZ1kyeGhjM005SW1GdWFXMWhkR1ZrTFhSbGVIUWlJR1p2Ym5RdGMybDZaVDBpTWpBaVBqeDBaWGgwVUdGMGFDQjRiR2x1YXpwb2NtVm1QU0lqWTJseVkyeGxJaUJ6ZEdGeWRFOW1abk5sZEQwaU5UQWxJajQ4ZEhOd1lXNGdlRDBpTUNJZ1pIazlJaTB1TldWdElqNURiMjVtYkhWNElDMGdSR1YyWld4dmNHVnljeUF0SUZkdmNtdHphRzl3SUMwZ01qQXlNend2ZEhOd1lXNCtQQzkwWlhoMFVHRjBhRDQ4TDNSbGVIUStQSFJsZUhRZ1kyeGhjM005SW5sbFlYSWlQbDVmWGp3dmRHVjRkRDQ4TDNOMlp6ND0iLCJhdHRyaWJ1dGVzIjogW3sidHJhaXRfdHlwZSI6ICJjb2xvcjEiLCJ2YWx1ZSI6ICIjMDAwMEZGIn0seyJ0cmFpdF90eXBlIjogImNvbG9yMiIsInZhbHVlIjogIiNGRkE1MDAifSx7InRyYWl0X3R5cGUiOiAiZmFjZSIsInZhbHVlIjogIl5fXiJ9XX0=';
    expect(tokenURI).to.equal(expectedURI);
  });
  
  it('should revert when querying token URI for a nonexistent token', async () => {
    await expect(contract.tokenURI(0)).to.be.revertedWith('ERC721URI: URI query for nonexistent token');
  });
  
  it('should allow the owner to transfer a token', async () => {
    await contract.safeMint(addr1.address);
    await contract.connect(addr1).transferFrom(addr1.address, addr2.address, 0);
    const newOwner = await contract.ownerOf(0);
    expect(newOwner).to.equal(addr2.address);
  });
  
  it('should revert when a non-owner tries to transfer a token', async () => {
    await contract.safeMint(addr1.address);
    await expect(contract.connect(addr2).transferFrom(addr1.address, addr2.address, 0)).to.be.revertedWith(
      'ERC721: caller is not token owner or approved'
    );
  });
  
  it('should return the correct token balance for an address', async () => {
    await contract.safeMint(addr1.address);
    await contract.safeMint(addr1.address);
    await contract.safeMint(addr2.address);
  
    const balance1 = await contract.balanceOf(addr1.address);
    const balance2 = await contract.balanceOf(addr2.address);
  
    expect(balance1).to.equal(2);
    expect(balance2).to.equal(1);
  });
  
  it('should return the correct token by index', async () => {
    await contract.safeMint(addr1.address);
    await contract.safeMint(addr2.address);
  
    const tokenAtIndex0 = await contract.tokenByIndex(0);
    const tokenAtIndex1 = await contract.tokenByIndex(1);
  
    expect(tokenAtIndex0).to.equal(0);
    expect(tokenAtIndex1).to.equal(1);
  });
  
  it('should revert when querying token by index for an invalid index', async () => {
    await contract.safeMint(addr1.address);
    await contract.safeMint(addr2.address);
  
    await expect(contract.tokenByIndex(2)).to.be.revertedWith('ERC721Enumerable: global index out of bounds');
  });
  
  it('should support the ERC721Enumerable interface', async () => {
    const supportsEnumerable = await contract.supportsInterface('0x780e9d63');
    expect(supportsEnumerable).to.be.true;
  });
  
  it('should support the ERC721 interface', async () => {
    const supportsERC721 = await contract.supportsInterface('0x80ac58cd');
    expect(supportsERC721).to.be.true;
  });
  
});
