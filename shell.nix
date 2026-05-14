{ pkgs ? import (builtins.fetchTarball {
  url = "https://github.com/NixOS/nixpkgs/archive/nixos-24.11.tar.gz";
}) {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.chromium
    pkgs.jetbrains.idea-community
    pkgs.nodejs_22
  ];

  shellHook = ''
    node -v
  '';
}
