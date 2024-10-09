import Array "mo:base/Array";
import Hash "mo:base/Hash";

import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Text "mo:base/Text";

actor {
  stable var imageEntries : [(Text, Text)] = [];
  var images = HashMap.HashMap<Text, Text>(10, Text.equal, Text.hash);
  stable var nextId : Nat = 0;

  system func preupgrade() {
    imageEntries := Iter.toArray(images.entries());
  };

  system func postupgrade() {
    images := HashMap.fromIter<Text, Text>(imageEntries.vals(), 10, Text.equal, Text.hash);
  };

  public func saveImage(imageData : Text) : async Text {
    let id = Nat.toText(nextId);
    images.put(id, imageData);
    nextId += 1;
    id
  };

  public query func getImage(id : Text) : async ?Text {
    images.get(id)
  };
}
