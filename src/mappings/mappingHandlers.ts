import {SubstrateExtrinsic,SubstrateEvent,SubstrateBlock} from "@subql/types";
import {PuzzleCreatedEvent, AnswerCreatedEvent, ChallengeDepositEvent, ChallengeStatusChangeEvent} from "../types";
import {Balance} from "@polkadot/types/interfaces";


export async function handlePuzzleCreatedEvent(event: SubstrateEvent): Promise<void> {
    const {event: {data: [who, puzzle_hash, create_bn, deposit]}} = event;
    const record = new PuzzleCreatedEvent(puzzle_hash.toHuman().toString());
    record.who = who.toString();
    record.puzzle_hash = puzzle_hash.toHuman().toString();
    record.create_bn = create_bn.toString();
    record.event_bn = event.block.block.header.number.toString();
    record.deposit = (deposit as Balance).toBigInt();
    await record.save();
}

export async function handleAnswerCreatedEvent(event: SubstrateEvent): Promise<void> {
    const {event: {data: [who, answer_content, puzzle_hash, create_bn, result_type]}} = event;
    await makeSurePuzzleCreated(puzzle_hash.toHuman().toString());
    const record = new AnswerCreatedEvent(puzzle_hash.toHuman().toString());
    record.who = who.toString();
    record.answer_content = answer_content.toHuman().toString();
    record.create_bn = create_bn.toString();
    record.event_bn = event.block.block.header.number.toString();
    record.puzzle_hash = puzzle_hash.toHuman().toString();
    record.puzzle_infoId = puzzle_hash.toHuman().toString();
    record.result_type = result_type.toHuman().toString();
    await record.save();
}

export async function handleChallengeDepositEvent(event: SubstrateEvent): Promise<void> {
    const {event: {data: [puzzle_hash, who, deposit, deposit_type]}} = event;
    await makeSurePuzzleCreated(puzzle_hash.toHuman().toString());
    const record = new ChallengeDepositEvent(`${event.block.block.header.number.toString()}-${event.idx}`);
    record.who = who.toString();
    record.puzzle_hash = puzzle_hash.toHuman().toString();
    record.event_bn = event.block.block.header.number.toString();
    record.deposit = (deposit as Balance).toBigInt();
    record.deposit_type = deposit_type.toHuman().toString();
    record.puzzle_infoId = puzzle_hash.toHuman().toString();
    await record.save();
}

export async function handleChallengeStatusChangeEvent(event: SubstrateEvent): Promise<void> {
    const {event: {data: [puzzle_hash, stauts_info]}} = event;
    await makeSurePuzzleCreated(puzzle_hash.toHuman().toString());
    const record = new ChallengeStatusChangeEvent(`${event.block.block.header.number.toString()}-${event.idx}`);

    record.event_bn = event.block.block.header.number.toString();
    logger.info(`request_data C::#### ${stauts_info.toString()}, ${stauts_info.toHuman()}`);
    for(const key in stauts_info.toHuman() as any) {
        record.challenge_status = key;
        record.change_bn = stauts_info.toHuman()[key];
    }
    logger.info(`record = ${record}`);
    record.puzzle_infoId = puzzle_hash.toHuman().toString();
    await record.save();
}

async function makeSurePuzzleCreated(puzzle_hash:string):Promise<void> {
    let puzzleCreated = await PuzzleCreatedEvent.get(puzzle_hash);
    if(!puzzleCreated) {
        puzzleCreated = new PuzzleCreatedEvent(puzzle_hash);
        puzzleCreated.puzzle_hash = puzzle_hash;
        await puzzleCreated.save();
    }
}



// export async function handleBlock(block: SubstrateBlock): Promise<void> {
//     //Create a new starterEntity with ID using block hash
//     let record = new StarterEntity(block.block.header.hash.toString());
//     //Record block number
//     record.field1 = block.block.header.number.toNumber();
//     await record.save();
// }
//
// export async function handleEvent(event: SubstrateEvent): Promise<void> {
//     const {event: {data: [account, balance]}} = event;
//     //Retrieve the record by its ID
//     const record = await StarterEntity.get(event.block.block.header.hash.toString());
//     record.field2 = account.toString();
//     //Big integer type Balance of a transfer event
//     record.field3 = (balance as Balance).toBigInt();
//     await record.save();
// }
//
// export async function handleCall(extrinsic: SubstrateExtrinsic): Promise<void> {
//     const record = await StarterEntity.get(extrinsic.block.block.header.hash.toString());
//     //Date type timestamp
//     record.field4 = extrinsic.block.timestamp;
//     //Boolean tyep
//     record.field5 = true;
//     await record.save();
// }


