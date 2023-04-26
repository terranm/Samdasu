import { GameObject, Quaternion, Transform, WaitForSeconds } from 'UnityEngine'
import { Room } from 'ZEPETO.Multiplay';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoWorldMultiplay } from 'ZEPETO.World';

export default class TrashManager extends ZepetoScriptBehaviour {

    /* Managers Properties */
    @SerializeField() private trashPrefabs:GameObject[];
    private trashPositionsGroup:Transform;
    private trashPosisions:Transform[] = [];
    private trashFoolGroup:Transform;
    private trashFool:GameObject[] = [];
    
    /* Default Properties */
    private multiplay: ZepetoWorldMultiplay;
    private room: Room;

    Start() {
        this.multiplay = GameObject.FindObjectOfType<ZepetoWorldMultiplay>();
        this.multiplay.RoomJoined += (room: Room) => {
            this.room = room;
        }
        this.trashPositionsGroup = this.transform.GetChild(0);
        this.trashFoolGroup = this.transform.GetChild(1);
        for(const trans of this.trashPositionsGroup.GetComponentsInChildren<Transform>()) {
            if(this.trashPositionsGroup == trans) continue;
            this.trashPosisions.push(trans);
        }
        this.StartCoroutine(this.StartLoading());
    }

    /* Start Loading */
    private * StartLoading()
    {
        this.ShuffleArray(this.trashPrefabs);
        const wait = new WaitForSeconds(1);
        yield wait;
        for(let i=0; i<30; i++) {
            const trash = GameObject.Instantiate(
                this.trashPrefabs[i%this.trashPrefabs.length], this.trashFoolGroup.position, Quaternion.identity, this.trashFoolGroup) as GameObject;
            this.trashFool.push(trash);
        }
        // sample code
        this.RandomPositionSelect();
        // sample code

        this.StopCoroutine(this.StartLoading());
    }

    /* Set Trashes */
    private RandomPositionSelect() {
        this.ShuffleArray(this.trashPosisions);
        for(let i=0; i<this.trashFool.length; i++) {
            this.trashFool[i].transform.position = this.trashPosisions[i].position;
            this.trashFool[i].SetActive(true);
        }
    }
    
    /* Random Shuffle */
    private ShuffleArray(array: any[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

}