import { Component, Input, OnChanges, OnInit, Output, EventEmitter, TemplateRef, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { Configuration, ListStyle, MultilevelNodes, ExpandCollapseStatusEnum } from './../app.model';
import { CONSTANT } from './../constants';
import { MultilevelMenuService } from './../multilevel-menu.service';
import { SlideInOut, ExpandedLTR, ExpandedRTL  } from './../animation';
@Component({
  selector: 'ng-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.css'],
  animations: [SlideInOut, ExpandedLTR, ExpandedRTL]
})
export class ListItemComponent implements OnChanges, OnInit {
  @Input() node: MultilevelNodes;
  @Input() level = 1;
  @Input() submenuLevel = 0;
  @Input() selectedNode: MultilevelNodes;
  @Input() nodeConfiguration: Configuration = null;
  @Input() nodeExpandCollapseStatus: ExpandCollapseStatusEnum = null;
  @Input() listTemplate: TemplateRef<ElementRef> = null;

  @Output() selectedItem = new EventEmitter<MultilevelNodes>();

  isSelected = false;
  expanded = false;
  firstInitializer = false;
  
  nodeChildren: MultilevelNodes[];
  classes: { [index: string]: boolean };
  selectedListClasses: { [index: string]: boolean };
  
  constructor(
    private router: Router,
    public multilevelMenuService: MultilevelMenuService
  ) {
    this.selectedListClasses = {
      [CONSTANT.DEFAULT_LIST_CLASS_NAME]: true,
      [CONSTANT.SELECTED_LIST_CLASS_NAME]: false,
      [CONSTANT.ACTIVE_ITEM_CLASS_NAME]: false,
    };
  }
  ngOnChanges() {
    this.nodeChildren = this.node && this.node.items ? this.node.items.filter(n => !n.hidden) : [];
    this.node.hasChilden = this.hasItems();

    if (this.selectedNode !== undefined && this.selectedNode !== null) {
      this.setSelectedClass(this.multilevelMenuService.recursiveCheckId(this.node, this.selectedNode.id));
    }
    this.setExpandCollapseStatus();
  }
  ngOnInit() {
    this.selectedListClasses[CONSTANT.DISABLED_ITEM_CLASS_NAME] = this.node.disabled;

    if (this.node.faIcon !== null &&
      this.node.faIcon !== undefined &&
      this.node.faIcon.match(/\bfa\w(?!-)/) === null) {
      this.node.faIcon = `fas ${this.node.faIcon}`;
    }

    this.selectedListClasses[`level-${this.level}-submenulevel-${this.submenuLevel}`] = true;
    if (typeof this.node.expanded === 'boolean') {
      this.expanded = this.node.expanded;
    }
    this.setClasses();
  }
  setSelectedClass(isFound: boolean): void {
    if (isFound) {
      if (!this.firstInitializer) {
        this.expanded = true;
      }
      this.isSelected = this.nodeConfiguration.highlightOnSelect || this.selectedNode.items === undefined ? true : false;
    } else {
      this.isSelected = false;
      if (this.nodeConfiguration.collapseOnSelect) {
        this.node.expanded = false;
        this.expanded = false;
      }
    }
    this.selectedListClasses = {
      [CONSTANT.DEFAULT_LIST_CLASS_NAME]: true,
      [CONSTANT.SELECTED_LIST_CLASS_NAME]: this.isSelected,
      [CONSTANT.ACTIVE_ITEM_CLASS_NAME]: this.selectedNode.id === this.node.id,
      [CONSTANT.DISABLED_ITEM_CLASS_NAME]: this.node.disabled,
      [`level-${this.level}-submenulevel-${this.submenuLevel}`]: true,
    };
    this.node.isSelected = this.isSelected;
    this.setClasses();
  }
  getPaddingAtStart(): boolean {
    return this.nodeConfiguration.paddingAtStart ? true : false;
  }
  getListStyle(): ListStyle {
    const styles = {
      background: CONSTANT.DEFAULT_LIST_BACKGROUND_COLOR,
      color: CONSTANT.DEFAULT_LIST_FONT_COLOR
    };
    if (this.nodeConfiguration.listBackgroundColor !== null) {
      styles.background = this.nodeConfiguration.listBackgroundColor;
    }
    if (this.isSelected) {
      this.nodeConfiguration.selectedListFontColor !== null ?
        styles.color = this.nodeConfiguration.selectedListFontColor : styles.color = CONSTANT.DEFAULT_SELECTED_FONT_COLOR;
    } else if (this.nodeConfiguration.fontColor !== null) {
      styles.color = this.nodeConfiguration.fontColor;
    }
    return styles;
  }
  getListIcon(node: MultilevelNodes): string {
    if (node.icon !== null && node.icon !== undefined && node.icon !== '') {
      return `icon`;
    } else if (node.faIcon !== null && node.faIcon !== undefined && node.faIcon !== '') {
      return `faicon`;
    } else if (node.imageIcon !== null && node.imageIcon !== undefined && node.imageIcon !== '') {
      return `imageicon`;
    } else if (node.svgIcon !== null && node.svgIcon !== undefined && node.svgIcon !== '') {
      return `svgicon`;
    } else {
      return ``;
    }
  }
  getSelectedSvgIcon() {
    if (this.isSelected && this.node.activeSvgIcon) {
      return this.node.activeSvgIcon;
    }
    return this.node.svgIcon;
  }
  getSelectedIcon() {
    if (this.isSelected && this.node.activeIcon) {
      return this.node.activeIcon;
    }
    return this.node.icon;
  }
  getSelectedFaIcon() {
    if (this.isSelected && this.node.activeFaIcon) {
      return this.node.activeFaIcon;
    }
    return this.node.faIcon;
  }
  getSelectedImageIcon() {
    if (this.isSelected && this.node.activeImageIcon) {
      return this.node.activeImageIcon;
    }
    return this.node.imageIcon;
  }
  getHrefTargetType() {
    if (this.node.hrefTargetType) {
      return this.node.hrefTargetType;
    }
    return CONSTANT.DEFAULT_HREF_TARGET_TYPE;
  }
  hasItems(): boolean {
    return this.nodeChildren.length > 0 ? true : false;
  }
  isRtlLayout(): boolean {
    return this.nodeConfiguration.rtlLayout;
  }
  setClasses(): void {
    this.classes = {
      [`level-${this.level + 1}`]: true,
      [CONSTANT.SUBMENU_ITEM_CLASS_NAME]: this.hasItems() && this.getPaddingAtStart(),
      [CONSTANT.HAS_SUBMENU_ITEM_CLASS_NAME]: this.hasItems()
    };
  }
  setExpandCollapseStatus(): void {
    if (this.nodeExpandCollapseStatus !== null && this.nodeExpandCollapseStatus !== undefined ) {
      if (this.nodeExpandCollapseStatus === ExpandCollapseStatusEnum.expand) {
        this.expanded = true;
        if (this.nodeConfiguration.customTemplate) {
          this.node.expanded = true;
        }
      }
      if (this.nodeExpandCollapseStatus === ExpandCollapseStatusEnum.collapse) {
        this.expanded = false;
        if (this.nodeConfiguration.customTemplate) {
          this.node.expanded = false;
        }
      }
    }
  }
  expand(node: MultilevelNodes): void {
    if (node.disabled) {
      return;
    }
    this.nodeExpandCollapseStatus = ExpandCollapseStatusEnum.neutral;
    this.expanded = !this.expanded;
    this.node.expanded =  this.expanded;
    this.firstInitializer = true;
    this.setClasses();
    if (this.nodeConfiguration.interfaceWithRoute !== null
      && this.nodeConfiguration.interfaceWithRoute
      && node.link !== undefined
      && node.link
    ) {
      this.router.navigate([node.link], node.navigationExtras);
    } else if (node.onSelected && typeof node.onSelected === 'function') {
      node.onSelected(node);
      this.selectedListItem(node);
    } else if (node.items === undefined || this.nodeConfiguration.collapseOnSelect) {
      this.selectedListItem(node);
    }
  }
  selectedListItem(node: MultilevelNodes): void {
    this.selectedItem.emit(node);
  }
}
