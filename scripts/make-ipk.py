#!/usr/bin/env python3
"""
Build luci-theme-desktop_*.ipk (Architecture: all) without OpenWrt SDK.
Layout matches LuCI theme install paths used by deploy.sh / OpenWrt.
"""
from __future__ import annotations

import gzip
import io
import os
import stat
import tarfile
from pathlib import Path

# --- package metadata (keep in sync with Makefile) ---
PKG = "luci-theme-desktop"
VERSION = os.environ.get("PKG_VERSION", "1.0.0")
RELEASE = os.environ.get("PKG_RELEASE", "20260503")
VERSION_FULL = f"{VERSION}-{RELEASE}"
ARCH = "all"
MAINTAINER = "LuCI Desktop Theme <https://github.com>"
SECTION = "luci"
LICENSE = "Apache-2.0"
DESCRIPTION = (
    "LuCI theme — desktop shell with dock, multi-window iframes, fnOS-style UI. "
    "Depends on luci-base (OpenWrt 23.05+ / ucode templates)."
)


def gnutar_gz(members: list[tuple[str, bytes, int]]) -> bytes:
    """members: (arcname, data, mode) paths relative to filesystem root (/www/...)."""
    buf = io.BytesIO()
    with tarfile.open(fileobj=buf, mode="w:gz", format=tarfile.GNU_FORMAT) as tf:
        for arcname, data, mode in members:
            ti = tarfile.TarInfo(name=arcname)
            ti.size = len(data)
            ti.mode = mode
            ti.uid = ti.gid = 0
            ti.uname = ti.gname = "root"
            tf.addfile(ti, io.BytesIO(data))
    return buf.getvalue()


def ar_archive(files: list[tuple[str, bytes]]) -> bytes:
    """Minimal GNU / SYSV common ar archive (opkg-compatible)."""
    out = bytearray()
    out.extend(b"!<arch>\n")
    for name, body in files:
        if len(name) > 16:
            raise ValueError(f"ar member name too long: {name!r}")
        body = bytes(body)
        hdr = (
            name.encode("ascii").ljust(16)
            + b"0           "
            + b"0     "
            + b"0     "
            + b"100644  "
            + str(len(body)).encode("ascii").rjust(10)
            + b"`\n"
        )
        if len(hdr) != 60:
            raise RuntimeError("bad ar header length")
        out.extend(hdr)
        out.extend(body)
        if len(body) % 2 == 1:
            out.append(0x0A)
    return bytes(out)


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    dist = root / "dist"
    dist.mkdir(parents=True, exist_ok=True)
    ipk_path = dist / f"{PKG}_{VERSION_FULL}_{ARCH}.ipk"

    # staged file paths as on router (leading ./ for data.tar)
    data_files: list[tuple[str, bytes, int]] = []

    def add(rel: str, src: Path, mode: int = 0o644) -> None:
        data_files.append((rel, src.read_bytes(), mode))

    add("./www/luci-static/desktop/css/cascade.css", root / "htdocs/luci-static/desktop/css/cascade.css")
    add("./www/luci-static/desktop/favicon.ico", root / "htdocs/luci-static/desktop/favicon.ico")
    add("./www/luci-static/resources/menu-desktop.js", root / "htdocs/luci-static/resources/menu-desktop.js")

    for ut in (root / "ucode/template/themes/desktop").glob("*.ut"):
        add(f"./usr/share/ucode/luci/template/themes/desktop/{ut.name}", ut)

    uci = root / "root/etc/uci-defaults/99_luci-theme-desktop"
    add("./etc/uci-defaults/99_luci-theme-desktop", uci, 0o755)

    acl = root / "root/usr/share/rpcd/acl.d/luci-theme-desktop.json"
    add("./usr/share/rpcd/acl.d/luci-theme-desktop.json", acl)

    data_tgz = gnutar_gz(data_files)

    installed_size = sum(len(d) for _, d, _ in data_files) // 1024 + 1

    control_plain = (
        f"Package: {PKG}\n"
        f"Version: {VERSION_FULL}\n"
        f"Depends: libc, luci-base\n"
        f"Source: {PKG}\n"
        f"SourceName: {PKG}\n"
        f"License: {LICENSE}\n"
        f"Section: {SECTION}\n"
        f"Priority: optional\n"
        f"Architecture: {ARCH}\n"
        f"Installed-Size: {installed_size}\n"
        f"Maintainer: {MAINTAINER}\n"
        f"Description: {DESCRIPTION}\n"
    ).encode("utf-8")

    control_tgz = gnutar_gz([("./control", control_plain, 0o644)])
    debian_binary = b"2.0\n"

    ipk_bytes = ar_archive(
        [
            ("debian-binary", debian_binary),
            ("control.tar.gz", control_tgz),
            ("data.tar.gz", data_tgz),
        ]
    )

    ipk_path.write_bytes(ipk_bytes)
    print(f"Wrote {ipk_path} ({len(ipk_bytes)} bytes)")


if __name__ == "__main__":
    main()
